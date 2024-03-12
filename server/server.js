// const express = require("express");
import express from "express";
// const dotenv = require("dotenv");
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoute from "./routes/userRoute.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
// const app = express();
import {app,server} from "./socket/socket.js";

const PORT = process.env.PORT || 5000;
// const PORT = 5000;
dotenv.config();

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);
app.use("/api/users",userRoute);


app.get("/",(req,res) => {
    res.send("Hello World");
}); 



server.listen(PORT,() => {
connectToMongoDB()
console.log(`server running on port ${PORT}`);
});
