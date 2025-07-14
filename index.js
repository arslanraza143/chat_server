const express = require("express");
var http = require("http");// to create server 
const cors = require("cors");
const { Socket } = require("socket.io");

//create instance of express
const app = express();
const port = process.env.PORT || 5000;

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

//mongoos
// mongoos
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

// Show the URI during Railway deployment (for debugging only)
console.log("MONGO_URI:", uri);

if (!uri) {
  console.error("❌ MONGO_URI is undefined! Please set it in Railway → Variables tab.");
  process.exit(1); // Stop the app
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connected"));

//middleware initialize 
app.use(express.json());
app.use(cors());

var clients = {};
const routes = require("./routes");
app.use("/routes", routes);

app.use("/uploads", express.static("uploads"));//to serve static files from uploads folder
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