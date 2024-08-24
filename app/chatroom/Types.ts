//对话记录
export interface Message{
    messageId:number;
    roomId:number;
    sender:string;
    content:string;
    time:string;
}

//房间
export interface RoomPreviewInfo{
    roomId:number;
    roomName:string;
    lastMessage:Message;
}

export interface Response<T>{
    code:number;
    msg:string;
    data:T;
}

export interface MessageList{
    messages:Message[];
}

export interface RoomAddArgs{
    user:string;
    roomName:string;
}

export interface RoomDeleteArgs{
    user:string;
    roomId:number;
}

export interface MessageAddArgs{
    roomId:number;
    content:string;
    sender:string;
}