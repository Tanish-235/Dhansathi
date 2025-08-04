import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js"
import mongoose from "mongoose";


dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000

app.listen(5000,()=>{
    connectDB();
    console.log("server is running at" + PORT);
})

