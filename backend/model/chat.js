import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: { type: String }, // or userId if you have authentication
  message: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", chatSchema);