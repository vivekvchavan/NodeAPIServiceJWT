const express=require('express');
const port = 5000;
const app = express();
const dotenv= require('dotenv');
const mongoose=require('mongoose');


const authRoute = require('./routes/authenticate');
const postRoute= require('./routes/post');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser:true, useUnifiedTopology: true },
        ()=> console.log('Connected to MongoDB Database'));


app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(port, ()=> console.log('API Service started on port : '+port));

