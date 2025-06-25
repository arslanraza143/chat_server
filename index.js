const express = require("express");
var http = require("http");// to create server 
const cors = require("cors");
const { Socket } = require("socket.io");

//create instance of express
const app = express();
const port = process.env.port || 5000;

//create new sever
var server = http.createServer(app);

//import socket io and initialize server and provide object 
const io = require('socket.io')(server, 
//     {
//     cors: {

//         origin:"*"
//     }
// }

)

//middleware initialize 
app.use(express.json());
// app.use(cors());

var clients = {};

//working on socket io part open connection with connection event 
io.on("connection", (socket)=>{
    console.log('Connected');
    console.log(socket.id, "has joined");
    socket.on("signin",(id)=>{
    console.log(id);
    clients[id]=socket;
    console.log(clients);
    }),
    socket.on("message", (msg)=>{
        console.log(msg);
    let targetId =msg.targetId;
    if(clients[targetId])
    clients[targetId].emit("message", msg);
    })
});

app.route('/check').get((req, res)=>{
    return res.json('app is file');
})

//initiate server
server.listen(port,"0.0.0.0",()=>{
    console.log(`server started at ${port}`);
    
});