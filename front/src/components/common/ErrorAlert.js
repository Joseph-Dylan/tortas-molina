import React from "react";
import { Alert, Button } from "react-bootstrap";

/**
 * Componente de error reutilizable
 * @param {string} message - Mensaje de error
 * @param {function} onRetry - Función para reintentar
 * @param {function} onDismiss - Función para cerrar la alerta
 * @param {string} title - Título del error
 */
const ErrorAlert = ({ message, onRetry, onDismiss, title = "Error" }) => {
  return (
    <Alert variant="danger" dismissible={!!onDismiss} onClose={onDismiss}>
      <Alert.Heading>{title}</Alert.Heading>
      <p>{message || "Ha ocurrido un error inesperado"}</p>

      {onRetry && (
        <div className="mt-3">
          <Button variant="outline-danger" size="sm" onClick={onRetry}>
            🔄 Reintentar
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default ErrorAlert;
