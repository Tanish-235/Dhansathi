import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js"
import mongoose from "mongoose";


dotenv.config();

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json());

app.use("/api/chat", chatRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running at port " + PORT);
});

