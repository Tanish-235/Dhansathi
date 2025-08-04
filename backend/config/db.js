import mongoose from "mongoose";

export const connectDB = async() =>{
    try{
        const con = await mongoose.connect(process.env.MONGO_DB);
        console.log(`monogodb connect ${con.connection.host}`);
    }
    catch(error){
        console.log(`error ${error.message}`);
        process.exit(1);
    }
}