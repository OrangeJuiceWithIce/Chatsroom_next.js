import { useState } from "react";
import {RoomPreviewInfo,RoomDeleteArgs} from './Types';
import { Dropdown } from "antd";  //右击下拉菜单组件
import Circle from './Circle';
import './RoomList.css';

//带有交互函数的房间
interface RoomProps extends RoomPreviewInfo{
    onClick: ()=>void;  //选择房间函数
    onDelete:()=>void;  //删除房间函数
    isSelect: boolean;  //是否被选中
}

//房间列表
interface RoomListProps {
    List: RoomPreviewInfo[];
    onClick: (roomId:number)=>void;
    onDelete: (props:RoomDeleteArgs)=>void;
    selectedId: number|null;  //当前选中的房间id

    onAdd:()=>void;//添加房间函数
    userName:string;  //当前用户名
    onUserMenu:()=>void;  //用户菜单点击事件
}

//房间列表中的某一条
function RoomMessage(props:RoomProps){
    //右击菜单是否显示
    const [showState,setShowState]=useState(true);
    
    //右击下拉菜单
    const items=[
        {
            label:'删除',
            key:'1',
            onClick:()=>{props.onDelete(),setShowState(false)},
        }
    ];

    if(!showState){
        return null;
    }

    return(
        <Dropdown menu={{items}} trigger={['contextMenu']}>
            <div className={`RoomContainer ${props.isSelect? 'selected' :''}`} onClick={props.onClick}>
                <Circle />
                <div className="RoomInfo">
                    <div className="NameAndTime">
                        <h2 style={{fontSize: '0.8rem'}}>{props.roomName}</h2>
                        <p style={{fontSize: '0.6rem',color:'#afafaf'}}>{props.lastMessage?String(props.lastMessage.time).slice(5,16):'--'}</p>
                    </div>
                    <p className="RoomContent"style={{fontSize: '0.6rem'}}>{props.lastMessage?props.lastMessage.content:'---'}</p>
                </div>
            </div>
        </Dropdown>
    )
}

//房间列表
function RoomList(props:RoomListProps){
    return(
        <div>
            <div className="RoomListTitle">
                <svg 
                    className='user'
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                    width="25" height="25"
                    onClick={props.onUserMenu}
                >
                    <path d="M763.634592 524.472594H696.906212a9.978076 9.978076 0 0 1-6.236297-17.461632 293.729598 293.729598 0 0 0 94.791717-218.270402A280.009744 280.009744 0 0 0 509.817296 0a280.009744 280.009744 0 0 0-268.784409 288.74056 293.729598 293.729598 0 0 0 94.791717 218.270402 9.978076 9.978076 0 0 1-6.236297 17.461632H260.365408a249.451888 249.451888 0 0 0-249.451888 249.451888 249.451888 249.451888 0 0 0 249.451888 249.451888h503.269184a249.451888 249.451888 0 0 0 249.451888-249.451888 249.451888 249.451888 0 0 0-249.451888-249.451888zM509.817296 105.393423a177.73447 177.73447 0 0 1 174.616322 183.347137A178.3581 178.3581 0 0 1 509.817296 472.087698a178.3581 178.3581 0 0 1-170.250914-183.347138A177.73447 177.73447 0 0 1 509.817296 105.393423z m365.447016 685.992691A115.371498 115.371498 0 0 1 759.269184 899.897686H260.365408a115.371498 115.371498 0 0 1-124.725944-107.887942v-38.041413a115.371498 115.371498 0 0 1 124.725944-107.887941h498.903776a115.371498 115.371498 0 0 1 120.984166 107.887941z"/>
                </svg>
                <span className="userName">{props.userName}</span>
                <svg  //加号按钮
                    className="plus"
                    style={{float:'right'}}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                    width="30" height="30"
                    onClick={props.onAdd} //添加房间函数
                >
                    <path d="M480 64A416.64 416.64 0 0 0 64 480 416.64 416.64 0 0 0 480 896 416.64 416.64 0 0 0 896 480 416.64 416.64 0 0 0 480 64z m0 64C674.752 128 832 285.248 832 480S674.752 832 480 832A351.552 351.552 0 0 1 128 480C128 285.248 285.248 128 480 128zM448 256v192H256v64h192v192h64V512h192V448H512V256z"/>
                </svg>
            </div>
            <div className="RoomList">
                {props.List.map(room=>(
                    <RoomMessage
                    key={room.roomId}
                    onClick={()=>{props.onClick(room.roomId)}}
                    onDelete={()=>{props.onDelete({user:props.userName,roomId:room.roomId})}}
                    roomId={room.roomId} roomName={room.roomName} lastMessage={room.lastMessage}
                    isSelect={props.selectedId===room.roomId}
                    />
                ))}
            </div>
        </div>
    )
}

export default RoomList;