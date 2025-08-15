import mongoose from "mongoose";

const scheme = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
})

const Tutorial = mongoose.model('Tutorial', scheme);

export default Tutorial;