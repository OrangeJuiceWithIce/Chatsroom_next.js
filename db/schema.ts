import{mysqlTable,int,varchar,json,datetime} from 'drizzle-orm/mysql-core';

export const rooms=mysqlTable(
    'rooms',
    {
        roomId:int('roomId').primaryKey().autoincrement().notNull(),
        roomName:varchar('roomName',{length:30}).notNull(),
        lastMessage:json('lastMessage').notNull(),
    }
);

export const messages=mysqlTable(
    'messages',
    {
        messageId:int('messageId').primaryKey().autoincrement().notNull(),
        roomId:int('roomId').notNull(),
        sender:varchar('sender',{length:30}).notNull(),
        content:varchar('content',{length:80}).notNull(),
        time:datetime('time').notNull(),
    }
)