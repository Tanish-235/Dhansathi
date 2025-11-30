import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${con.connection.host}`);
    }
    catch(error) {
        console.log(`MongoDB connection error: ${error.message}`);
        // Don't exit process for now, just log the error
        console.log("Continuing without database connection.");
    }
}

export default connectDB;