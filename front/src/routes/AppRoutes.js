import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { ROUTES } from "../utils/constants";

// Lazy loading de páginas para mejor performance
const Home = React.lazy(() => import("../pages/Home"));
const Products = React.lazy(() => import("../pages/Products"));
const Cart = React.lazy(() => import("../pages/Cart"));
const Orders = React.lazy(() => import("../pages/Orders"));
const Profile = React.lazy(() => import("../pages/Profile"));
const Login = React.lazy(() => import("../pages/Login"));
const Register = React.lazy(() => import("../pages/Register"));

/**
 * Componente de rutas de la aplicación
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.PRODUCTS} element={<Products />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      {/* Rutas privadas (requieren autenticación) */}
      <Route
        path={ROUTES.CART}
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.ORDERS}
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.PROFILE}
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Ruta 404 - Redirigir a home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
