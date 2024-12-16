import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/events", // Asegúrate de que esta URL coincide con tu backend
});

// Interceptor para agregar token a las solicitudes
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

// Funciones de eventos
export const createEvent = (eventData) => {
  try {
    const response = api.post("/", eventData);
    return response.data;
  } catch (error) {
    return console.error("Error al crear evento:", error);
  }
};

export const updateEvent = (eventId, eventData) => {
  api.put(`/${eventId}`, eventData).catch(handleError);
};

export const deleteEvent = (eventId) =>
  api.delete(`/${eventId}`).catch(handleError);

export const getEventById = (id) => api.get(`/${id}`).catch(handleError); // Asegúrate de que la URL sea correcta

export const getEvents = () => api.get("/").catch(handleError);

export const getEventsByUserId = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`); // Ajusta la ruta si es necesario
    return response.data;
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    throw error; // Re-lanza el error
  }
};

export const joinEvent = async (eventId) => {
  try {
    const response = await api.post(`/${eventId}/join`);
    // Validar la respuesta
    if (response && response.data && response.data.event) {
      return response.data; // Retorna el resultado de unirse al evento
    } else {
      throw new Error(
        "La respuesta del servidor no tiene la estructura esperada."
      );
    }
  } catch (error) {
    handleError(error); // Maneja el error de la solicitud
    return { error: "Error al unirse al evento" }; // Retorna un objeto con error
  }
};

export const leaveEvent = async (eventId) => {
  try {
    const response = await api.post(`/${eventId}/leave`);
    // Validar la respuesta
    if (response && response.data && response.data.event) {
      return response.data; // Retorna el resultado de dejar el evento
    } else {
      throw new Error(
        "La respuesta del servidor no tiene la estructura esperada."
      );
    }
  } catch (error) {
    handleError(error); // Maneja el error de la solicitud
    return { error: "Error al abandonar el evento" }; // Retorna un objeto con error
  }
};

export const getEventsByDate = (date) =>
  api.get(`/date/${date}`).catch(handleError);

export const getEventsByLocation = (location) =>
  api.get(`/location/${location}`).catch(handleError);

export const getEventsByTitle = (title) =>
  api.get(`/title/${title}`).catch(handleError);

export const getEventsByDescription = (description) =>
  api.get(`/description/${description}`).catch(handleError);

export const likeEvent = async (id) => {
  try {
    const response = await api.post(`/${id}/like`);
    return response.data; // Retorna el resultado del "like"
  } catch (error) {
    handleError(error);
  }
};

export const commentOnEvent = async (id, commentData) => {
  try {
    const response = await api.post(`/${id}/comment`, commentData);
    return response.data; // Retorna el comentario creado
  } catch (error) {
    handleError(error);
  }
};

export const getRelatedEvents = async (eventId) => {
  try {
    const response = await api.get(`/${eventId}/related`);
    return response.data; // Retorna las publicaciones relacionadas
  } catch (error) {
    handleError(error);
  }
};
