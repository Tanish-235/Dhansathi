import mongoose from "mongoose";

const scheme = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    url:{
        type:String,
        require:true
    }
})

const tutorial = mongoose.model('tutorial',scheme);
module.exports = tutorial;