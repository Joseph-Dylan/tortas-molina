import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  if(!user) return <Navigate to="/login" />

  if(requireAdmin && !isAdmin) return <Navigate to="/" />

  return children;
};

export default PrivateRoute;
