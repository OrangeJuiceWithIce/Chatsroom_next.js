import RoomList from './RoomList';
import Chatting from './Chatting';
import { useState, useEffect } from 'react';
import { Message, MessageAddArgs, RoomPreviewInfo, RoomAddArgs, RoomDeleteArgs } from './Types';
import './ChatsRoom.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '../trpc';
import {withTRPC} from '@trpc/next';
import {httpBatchLink} from "@trpc/client";
import {AppRouter} from '../server/router';

const ChatsRoom = () => {
    // 页面定位
    let navigate = useNavigate();
    const location = useLocation();
    const userName = location.state.userName;

    // 房间列表数据
    const [getList, setList] = useState<RoomPreviewInfo[]>([]);
    const [selectRoom, setSelectRoom] = useState<number | null>(null);
    const [MessageList, setMessageList] = useState<Message[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [userMenu, setUserMenu] = useState(false);

    // TRPC Hooks
    const { data: roomListData, refetch: refetchRoomList } = trpc.getRoomList.useQuery();
    const { data: messagesData, refetch: refetchMessages } = trpc.getMessageList.useQuery(
        { roomId: selectRoom !== null ? getList[selectRoom]?.roomId : null },
        { enabled: selectRoom !== null }
    );
    const { mutate: addRoom } = trpc.addRoom.useMutation();
    const { mutate: deleteRoom } = trpc.deleteRoom.useMutation();
    const { mutate: addMessage } = trpc.addMessage.useMutation();
    const { data: newMessagesData, refetch: refetchNewMessages } = trpc.updateMessage.useQuery(
        { roomId: selectRoom !== null ? getList[selectRoom]?.roomId : -1, sinceMessageId: messagesData?.data?.length ? messagesData.data[messagesData.data.length - 1].messageId : -1 },
        { enabled: selectRoom !== null }
    );

    // 更新房间列表数据
    useEffect(() => {
        if (roomListData&&roomListData.data) {
            setList(roomListData.data);
        } else {
            setList([]);
        }
    }, [roomListData]);

    // 选择房间函数
    const handleClick = (roomId: number) => {
        const index = getList.findIndex(item => item.roomId === roomId);
        setSelectRoom(index);
    };

    // 当 selectRoom 变化时，更新消息列表
    useEffect(() => {
        if (selectRoom !== null) {
            refetchMessages();
        }
    }, [selectRoom]);

    // 更新消息数据
    useEffect(() => {
        if (messagesData&&messagesData.data) {
            setMessageList(messagesData.data);
        } else {
            setMessageList([]);
        }
    }, [messagesData]);

    // 定时调用更新消息函数
    useEffect(() => {
        if (selectRoom !== null) {
            const intervalId = setInterval(() => {
                refetchNewMessages();
                if (newMessagesData&&newMessagesData.data) {
                    setMessageList(prev => [...prev, ...newMessagesData.data]);
                }
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [selectRoom, messagesData]);

    const handleDelete = async (props: RoomDeleteArgs) => {
        const index = getList.findIndex(item => item.roomId === props.roomId);
        deleteRoom(props);
        await refetchRoomList();
        if (selectRoom !== null) {
            if (selectRoom === index) {
                setSelectRoom(null);
            } else if (selectRoom > index) {
                setSelectRoom(selectRoom - 1);
            }
        }
    };

    const handleAdd = () => {
        setIsAdding(!isAdding);
        setUserMenu(false);
    };

    const handleSubmit = async (props: RoomAddArgs) => {
        setIsAdding(false);
        await addRoom({ roomName: props.roomName });
        await refetchRoomList();
    };

    const handleMessage = async (props: MessageAddArgs) => {
        await addMessage({ content: props.content, roomId: props.roomId, sender: props.sender });
        await refetchRoomList();
        (document.getElementById('ChattingInput') as HTMLInputElement).value = '';
    };

    const handleUserMenu = () => {
        setUserMenu(!userMenu);
        setIsAdding(false);
    };

    const userMenuList = () => (
        <div className='userMenuContainer'>
            <div className='userMenuList'>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li>用户信息</li>
                    <li onClick={() => { setUserMenu(false); navigate('/'); }}>退出登录</li>
                </ul>
            </div>
        </div>
    );

    const AddList = () => (
        <div className={`addRoomForm`}>
            <label htmlFor='roomName'>房间名称:</label>
            <input type='text' id='roomName' required />
            <br />
            <button id='createRoom' onClick={() => { handleSubmit({ user: userName, roomName: (document.getElementById('roomName') as HTMLInputElement).value }); }}>创建房间</button>
            <button id='cancelAdd' onClick={() => { setIsAdding(false); }}>取消创建</button>
        </div>
    );

    return (
        <div className="ChatsRoom">
            <RoomList
                List={getList} // 房间列表数据
                onClick={handleClick} // 选择房间函数
                onDelete={handleDelete} // 删除房间函数
                selectedId={selectRoom !== null ? getList[selectRoom]?.roomId : null} // 当前选中的房间 id
                onAdd={handleAdd} // 添加房间函数
                userName={userName} // 当前用户名称
                onUserMenu={handleUserMenu} // 用户下拉菜单函数
            />
            <Chatting
                Room={selectRoom !== null ? getList[selectRoom] : null} // 当前选中的房间数据
                messages={MessageList} // 聊天记录数据
                onSubmit={handleMessage} // 提交消息函数
                userName={userName} // 当前用户名称
            />
            {isAdding && AddList()}
            {userMenu && userMenuList()}
        </div>
    );
};

export default withTRPC<AppRouter>({
    config(opts){
        return{
            links:[
                httpBatchLink({
                    url:`http://localhost:3000/api/trpc`
                })
            ]
        };
    }
})(ChatsRoom);
