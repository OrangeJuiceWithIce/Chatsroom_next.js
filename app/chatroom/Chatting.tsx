import Circle from './Circle';
import {RoomPreviewInfo} from './Types';
import {MessageAddArgs,Message} from './Types';
import { MessageList } from './Types';
import './Chatting.css';

interface ChattingTitleProps{
    Room:RoomPreviewInfo|null;
    userName:string;
}

function MessageItem(props:Message){
    return(
        <div className='MessageItem'>
            <Circle />
            <div className="MessageText">
                <span className='MessageItem-sender' style={{fontSize:'0.8rem'}}>{props.sender}</span>
                <p className='MessageItem-content' style={{fontSize:'0.7rem'}}>{props.content}</p>
            </div>
        </div>
    )
}

function ChattingTitle(props:ChattingTitleProps){
    if(!props.Room){
        return null;
    }
    return (
        <div className="ChattingTitle">
            <Circle />
            <h2 style={{fontSize: '0.8rem',margin:5,width:300,paddingTop:15,paddingRight:10}}>{props.Room.roomName}</h2>
        </div>
    )
}

function Chats(props:MessageList){
    return(
        <div className='Chats'>
            {props.messages.map((message,index)=>(
                <MessageItem key={index} {...message}/>
                ))
            }
        </div>
    )
}

function Chatting(props:ChattingTitleProps&MessageList&{onSubmit:(props:MessageAddArgs)=>void}){
    if(!props.Room){
        return null;
    }
    return (
        <div className="Chatting">
            <ChattingTitle {...props} />
            <div className="ChattingContent">
                <Chats messages={props.messages} />
            </div>
            <input id="ChattingInput"></input>
            <button className="SendButton" onClick={()=>props.onSubmit({'roomId':props.Room?props.Room.roomId:0,'content':(document.getElementById('ChattingInput') as HTMLInputElement).value,'sender':props.userName})}>发送</button>
        </div>
    )
}

export default Chatting;