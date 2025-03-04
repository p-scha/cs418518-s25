// console.log("Hello World!");

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import user from './routes/user.js';
const app=express();
const port=8080;

const myLogger=function (req,res,next) {
    console.log("Logged");
    next();
}


app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`);
});

//app.use(cors(corsOptions));

app.use(cors({
    origin:'http://localhost:5173', // *
    allowedHeaders:['Content-Type'], // optional
    credentials: true,
}))

app.use(session({
    secret: 'unique_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Cookies are only accessible by the server
        secure: false,
        maxAge: 1000 * 60 * 60 * 24, // Cookie expiration
    }
}));


app.use(myLogger);
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    //res.send("Hello World!");
    res.json({'message':'Get API Response!'})
})

app.use('/user',user);

app.get('/:id',(req,res)=>{
    // res.send("Hello World!");
    res.json({'message':'Get API Response!'+ req.params.id})
})

app.put('/user',(req,res)=>{
    // res.send("Hello World!");
    res.json({'message':'PUT API Response!'})
})


export default app;

