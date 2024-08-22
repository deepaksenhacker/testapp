import dotenv from 'dotenv';
dotenv.config();
import {connect} from 'mongoose';
const mongo =process.env.CONN;

const Connection = async() =>{
try {
    await connect(mongo);
        console.log("Connected");
} catch (error) {
    console.log(error);
}

}



export default Connection;