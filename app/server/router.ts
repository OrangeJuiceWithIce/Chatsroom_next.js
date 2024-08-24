import {z} from 'zod';
import {router,publicProcedure} from './trpc'
import { createHTTPServer } from '@trpc/server/adapters/standalone';

import {db} from '../../db/index'
import {rooms,messages} from '../../db/schema'
import { desc, and,eq, gt } from 'drizzle-orm';

import {Message} from '../chatroom/Types';

export const appRouter=router({
    getRoomList:publicProcedure
    .query(async()=>{
        try{
            const result=await db
            .select({
                roomId:rooms.roomId,
                roomName:rooms.roomName,
                lastMessage:rooms.lastMessage,
            })
            .from(rooms);
            if (result&&result.length>0){
                const rooms=result.map(row=>({
                    roomId:row.roomId,
                    roomName:row.roomName,
                    lastMessage:JSON.parse(String(row.lastMessage))as Message,
                }));

                return{
                    msg:'success',
                    code:0,
                    data:rooms,
                };
            }
            else{
                return{
                    msg:'error',
                    code:1,
                    data:null,
                };
            }
        }
        catch(err){
            console.error('查询数据库失败',err);
            return{
                msg:'get room list error',
                code:1,
                data:null,
            };
        }
    }),
    addRoom:publicProcedure
    .input(z.object({roomName:z.string()}))
    .mutation(async(opts)=>{
        const{input}=opts;
        const{roomName}=input;
        try{
            await db.insert(rooms).values({roomName:roomName,lastMessage:null});
            return{
                msg:'success',
                code:0,
                data:null,
            }
        }
        catch(err){
            console.error('添加房间失败',err);
            return{
                msg:'add room error',
                code:1,
                data:null,
            }
        }
    }),
    deleteRoom:publicProcedure
    .input(z.object({roomId:z.number()}))
    .mutation(async(opts)=>{
        const {input}=opts;
        const {roomId}=input;
        try{
            await db.delete(rooms).where(eq(rooms.roomId,roomId));
            return{
                msg:'success',
                code:0,
                data:null,
            }
        }
        catch(err){
            console.error('删除房间失败',err);
            return{
                msg:'delete room error',
                code:1,
                data:null,
            }
        }
    }),
    addMessage:publicProcedure
    .input(z.object({roomId:z.number(),sender:z.string(),content:z.string()}))
    .mutation(async(opts)=>{
        const {input}=opts;
        try{
            await db.insert(messages).values({roomId:input.roomId,sender:input.sender,content:input.content,time:new Date()})
            const messageId=await db.select({messageId:messages.messageId}).from(messages).where(eq(messages.roomId,input.roomId)).orderBy(desc(messages.messageId)).limit(1);
            const lastMessage=JSON.stringify({messageId:messageId[0].messageId,roomId:input.roomId,sender:input.sender,content:input.content,time:new Date()});
            await db.update(rooms).set({lastMessage:lastMessage}).where(eq(rooms.roomId,input.roomId));
            return{
                msg:'success',
                code:0,
                data:null,
            }
        }
        catch(err){
            console.error('添加消息失败',err);
            return{
                msg:'error',
                code:1,
                data:null,
            }
        }
    }),
    getMessageList:publicProcedure
    .input(z.object({roomId:z.number().nullable()}))
    .query(async(opts)=>{
        const {input}=opts;
        const {roomId}=input;
        try{
            if(roomId){
                const result=await db.select({messageId:messages.messageId,roomId:messages.roomId,sender:messages.sender,content:messages.content,time:messages.time})
                .from(messages)
                .where(eq(messages.roomId,roomId));
                return{
                    msg:'success',
                    code:0,
                    data:result,
                }
            }
            else{
                return{
                    msg:'success',
                    code:0,
                    data:null,
                }
            }
        }
        catch(err){
            console.error('查询消息失败',err);
            return{
                msg:'get message list error',
                code:1,
                data:null,
            }
        }
    }),
    updateMessage:publicProcedure
    .input(z.object({roomId:z.number(),sinceMessageId:z.number()}))
    .query(async(opts)=>{
        const {input}=opts;
        try{
            const result=await db.select({messageId:messages.messageId,roomId:messages.roomId,sender:messages.sender,content:messages.content,time:messages.time})
            .from(messages)
            .where(and(eq(messages.roomId,input.roomId),gt(messages.messageId,input.sinceMessageId)))
            .orderBy(desc(messages.messageId));
            return{
                msg:'success',
                code:0,
                data:result,
            }
        }
        catch(err){
            console.error('更新消息失败',err);
            return{
                msg:'update message error',
                code:1,
                data:null,
            }
        }
    })
})

export type AppRouter=typeof appRouter;