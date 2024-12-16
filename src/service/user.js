// src/services/user.js
import axios from "axios";

// Configuración de axios para la baseURL del backend
const api = axios.create({
  baseURL: "http://localhost:5000/api/users", // Asegúrate de que esta URL coincide con la del backend
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de errores
const handleError = (error) => {
  console.error("API Error:", error.response || error.message);
  throw error;
};

// Funciones de usuario
export const getAllUsers = () => api.get("/").catch(handleError);

export const getUserById = (userId) => api.get(`/${userId}`).catch(handleError);

export const getUserByUsername = (username) =>
  api.get(`/search/${username}`).catch(handleError);

export const getUserProfile = (username) =>
  api.get(`/profile/${username}`).catch(handleError);

// Funciones protegidas
export const addUserToGroup = (userId, groupId) =>
  api.post("/group/addUser", { userId, groupId }).catch(handleError);

export const followUser = (userId) => {
  console.log("userId", userId);
  return api.post(`/follow/${userId}`).catch(handleError);
};

export const unfollowUser = (userId) =>
  api.post(`/unfollow/${userId}`).catch(handleError);
