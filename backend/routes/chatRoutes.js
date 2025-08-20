import express from "express";
import { Groq } from 'groq-sdk';
import systemPrompt from "../config/aiPrompt.js";
import { getChats } from "../controller/chatcontroller.js";

const router = express.Router();

// Function to clean up response formatting
const cleanResponse = (text) => {
  if (!text) return text;
  
  return text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1') // Remove *italic*
    .replace(/`(.*?)`/g, '$1') // Remove `code`
    .replace(/#{1,6}\s*(.*?)(?:\n|$)/g, '$1') // Remove headers
    .replace(/\|.*\|/g, '') // Remove table rows
    .replace(/-{3,}/g, '') // Remove long dashes
    .replace(/\n-{3,}\n/g, '\n\n') // Remove long dashes with newlines
    .replace(/\n\s*[-•]\s*/g, '\n') // Remove bullet points
    .replace(/\n\s*✅\s*/g, '\n') // Remove checkmarks
    .replace(/\n\s*❌\s*/g, '\n') // Remove X marks
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
    // Add proper spacing for better readability
    .replace(/(\d+\.\s)/g, '\n\n$1') // Add space before numbered points
    .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2') // Add space after sentences before new paragraphs
    .replace(/([.!?])\s*(\d+\.)/g, '$1\n\n$2') // Add space before numbered lists
    .replace(/([.!?])\s*([💡🎯💰🏦📱📊📈🔒💪🌟])/g, '$1\n\n$2') // Add space before emoji sections
    // Clean up any excessive spacing
    .replace(/\n{4,}/g, '\n\n') // Replace 4+ newlines with 2
    .trim();
};

import Chat from "../model/chat.js";

router.post("/chat", async (req, res) => {
  const { message, user = "guest" } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY not found in environment variables");
    return res.status(500).json({ error: "Groq API key not configured" });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      stream: false
    });

    let reply = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    reply = cleanResponse(reply);

    // Save chat to MongoDB
    const chat = new Chat({
      user,
      message,
      response: reply,
    });
    await chat.save();

    res.json({ reply });
  } catch (error) {
    console.error("Chat error details:", error);
    res.status(500).json({ error: "Something went wrong while processing your request" });
  }
});

router.get("/chats", getChats);

export default router;
