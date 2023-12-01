const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/BMS"); 

const express=require("express");

const app=express();

const isBlog = require("./middlewares/isBlog");

app.use(isBlog.isBlog);

//for admin routes
const adminRoute=require("./routes/adminRoute");
app.use('/',adminRoute);

//for user routes
const userRoute=require("./routes/userRoute");
app.use('/',userRoute);

//for blog routes
const blogRoute=require("./routes/blogRoute");
const { post } = require("jquery");
app.use('/',blogRoute);

app.listen(3000,function(){
    console.log("Server is running");
});



// var http = require('http').createServer(app);
// var { Server } = require('socket.io');
// var io= new Server(http,{});

// app.get('/',function(req,res){
//     res.send("hello");
// })

// io.on("connection",function(socket){
//     console.log('User Connected');

//     socket.on("delete_post",function(postId){
//         socket.broadcast.emit("delete_post", postId);
//     });
// });