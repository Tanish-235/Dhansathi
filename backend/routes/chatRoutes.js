import express from "express";
import { Groq } from 'groq-sdk';
import systemPrompt from "../config/aiPrompt.js";

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

// Test endpoint to verify API key
router.get("/test", async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    return res.json({ 
      status: "error", 
      message: "GROQ_API_KEY not found in environment variables" 
    });
  }
  
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Hello, this is a test message. Please respond with 'Test successful' if you can see this."
        }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      stream: false
    });

    const response = chatCompletion.choices[0]?.message?.content;
    
    res.json({ 
      status: "success", 
      message: "API key is working!",
      response: response
    });
  } catch (error) {
    console.error("Groq API test error:", error);
    res.json({ 
      status: "error", 
      message: "API test failed",
      error: error.message 
    });
  }
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  console.log("Chat request received:", { message, hasApiKey: !!process.env.GROQ_API_KEY });

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY not found in environment variables");
    return res.status(500).json({ error: "Groq API key not configured" });
  }

  try {
    console.log("Making request to Groq API...");
    
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

    console.log("Groq API response received");
    
    let reply = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    
    // Clean up the response formatting
    reply = cleanResponse(reply);
    
    console.log("Cleaned reply:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("Chat error details:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Something went wrong while processing your request" });
  }
});

export default router;
