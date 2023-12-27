const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const port = 4500 || process.env.PORT;

const users=[{}];


// const ENDPOINT = "http://localhost:4500";
// const socket = socketIO(ENDPOINT,{transports:['websocket']});

app.use(cors()); //cors is used for intercommunication between url

app.get('/',(req,res)=>{
    res.send("Hello its working");
})

const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{         //this is a whole circuit and sockets are different users
    console.log("new Connection");

    socket.on('joined',({user1})=>{
        users[socket.id]=user1;
        console.log(`${user1} has joined`);
        socket.emit('welcome',{user1:"Admin",message:`Welcome to the chat`});//sending from backend 
        socket.broadcast.emit('userJoined',{user1:"Admin",message:`${users[socket.id]} has joined`});//broadcast will send message to everyone other then the admin
    })

    socket.on('message',({message,id})=>{
        //io.emit('sendMessage',{user1:users[id],message})
        io.emit('sendMessage',{user1:users[id],message,id})//////////////
        // console.log(users[id]);
        // console.log(users[socket.id]);
    })

    socket.on('disconnect1',()=>{
        socket.broadcast.emit('leave',{user1:"Admin",message:`${users[socket.id]} has left`});
        // console.log("user left");
    })
})

server.listen(port,()=>{
    console.log(`server is working on ${port}`);
})