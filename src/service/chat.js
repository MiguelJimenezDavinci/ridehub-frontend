import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await axios.get(`${API_URL}/messages/${conversationId}`);
  return response.data;
};

export const sendMessage = async (message) => {
  const response = await axios.post(`${API_URL}/messages`, message);
  return response.data;
};

export const getOrCreateConversation = async (senderId, receiverId) => {
  try {
    const response = await axios.post(`${API_URL}/messages/conversations`, {
      senderId,
      receiverId,
    });
    return response.data;
  } catch (error) {
    console.error("Error in getOrCreateConversation:", error);
    throw error;
  }
};

export const getConversations = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/messages/conversations/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in getConversations:", error);
    throw error;
  }
};

export const getConversationById = async (conversationId) => {
  try {
    const response = await axios.get(
      `${API_URL}/messages/conversations/${conversationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in getConversationById:", error);
    throw error;
  }
};
