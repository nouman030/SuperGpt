import LLM from "../configs/Llm.js";
import Chat from "../models/Chats.js";
import User from "../models/User.js";

// Create a new chat
export const createChat = async (req, res) => {
  try {
    const { message, name } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ Success: false, message: "User not found" });
    }

    const chatData = {
      userId,
      name: name || "New Chat",
      userName: user.name,
      messages: [],
    };

    if (message) {
      chatData.messages.push({
        role: "user",
        content: message,
      });
    }

    const newChat = await Chat.create(chatData);

    res.status(201).json({ Success: true, chat: newChat });
  } catch (error) {
    res.status(500).json({ Success: false, message: error.message });
  }
};

// Add a message to an existing chat
export const addMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ Success: false, message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: message,
    });

    const LLM_response = await LLM(message);

    chat.messages.push({
      role: "assistant",
      content: LLM_response,
    });

    await chat.save();

    res.status(200).json({ Success: true, chat });
  } catch (error) {
    res.status(500).json({ Success: false, message: error.message });
  }
};

// Get all chats for a specific user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json({ Success: true, chats });
  } catch (error) {
    res.status(500).json({ Success: false, message: error.message });
  }
};

// Get a specific chat by ID
export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ Success: false, message: "Chat not found" });
    }

    res.status(200).json({ Success: true, chat });
  } catch (error) {
    res.status(500).json({ Success: false, message: error.message });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findByIdAndDelete(id);
    if (!chat) {
      return res.status(404).json({ Success: false, message: "Chat not found" });
    }

    res.status(200).json({ Success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ Success: false, message: error.message });
  }
};
