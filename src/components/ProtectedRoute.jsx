import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Si el usuario no está autenticado, redirigir a la página de registro
  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
