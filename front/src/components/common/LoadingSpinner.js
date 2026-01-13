import React from "react";
import { Spinner } from "react-bootstrap";

/**
 * Componente de loading reutilizable
 * @param {string} message - Mensaje a mostrar
 * @param {string} size - Tamaño del spinner (sm, md, lg)
 * @param {string} variant - Variante de color
 */
const LoadingSpinner = ({
  message = "Cargando...",
  size = "md",
  variant = "primary",
  fullScreen = false,
}) => {
  const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "lg" : undefined;

  const containerStyle = fullScreen
    ? {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }
    : {
        textAlign: "center",
        padding: "3rem 0",
      };

  return (
    <div style={containerStyle}>
      <Spinner
        animation="border"
        role="status"
        variant={variant}
        size={spinnerSize}
      />
      {message && <p className="mt-3 text-muted">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
