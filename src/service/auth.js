// src/services/auth.js
import axios from "axios";

// Configuración de axios para el backend
const api = axios.create({
  baseURL: "http://localhost:5000/api/auth", // Asegúrate de que esta URL coincide con la del backend
});

// Interceptor para agregar el token de autenticación a todas las solicitudes
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
  throw error; // Lanza el error para que pueda ser manejado donde se llame
};

// Funciones de autenticación
export const register = (userData) =>
  api.post("/register", userData).catch(handleError);

export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data; // Retorna los datos de la respuesta, que deberían incluir el token y el usuario
  } catch (error) {
    handleError(error); // Llama a la función de manejo de errores
  }
};

export const getUsers = () => api.get("/users").catch(handleError); // Asegúrate de manejar el error aquí también

// Funciones protegidas con autenticación
export const getProfile = () => api.get("/profile").catch(handleError);

export const updateProfile = (profileData) =>
  api.put("/profile", profileData).catch(handleError);

export const updateRole = (userId, role) => {
  const roleData = { userId, role };
  return api.put("/profile/role", roleData).catch(handleError);
};

export const deleteAccount = (userId) => {
  return api.delete(`/profile/${userId}`).catch(handleError);
};
