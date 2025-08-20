
import Chat from "../model/chat.js";

// Handler to save chat and respond
export const chatHandler = async (req, res) => {
  try {
    const { user = "guest", message } = req.body;

    // TODO: Replace with your actual AI response logic
    const aiResponse = "This is a sample AI response.";

    // Save chat to DB
    const chat = new Chat({
      user,
      message,
      response: aiResponse,
    });
    await chat.save();

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: "Failed to save chat." });
  }
};

// Handler to get all chats
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats." });
  }
};

