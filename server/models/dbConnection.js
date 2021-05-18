import dotenv from 'dotenv';
import pkg from 'pg';
const {Client} = pkg;

dotenv.config();

var client;
function connectDB() {
    if(!client){
        client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT
        });
        client.connect();
    }
    return client;
}

export default connectDB();