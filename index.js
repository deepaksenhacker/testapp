import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Connection from './database/conn.js';
dotenv.config();

import auth from './Routes/auth.js'


import posts from './Routes/posts.js'

Connection();

const app = express();
const port =process.env.PORT || 4000;
app.use(express.json());

app.use(cors());
app.use('/auth',auth);
app.use('/posts',posts)



app.get('/msg',(req,res)=>{
    res.send('Hey ');
})

app.listen(port, () => console.log(`Example app listening on port ${process.env.VITE_API_URL}`));



export default app;