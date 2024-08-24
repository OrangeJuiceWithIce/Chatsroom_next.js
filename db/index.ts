import mysql from 'mysql2/promise';
import {drizzle} from 'drizzle-orm/mysql2';

const poolConnection = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'liuhan73',
    database: 'ChatsRoom',
});

export const db=drizzle(poolConnection);