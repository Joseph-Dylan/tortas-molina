import React from "react";
import { Alert, Button } from "react-bootstrap";

/**
 * Componente para estados vacíos
 * @param {string} icon - Emoji o icono
 * @param {string} title - Título
 * @param {string} message - Mensaje descriptivo
 * @param {object} action - Objeto con {label, onClick} para botón de acción
 */
const EmptyState = ({
  icon = "📦",
  title = "No hay datos",
  message = "No se encontraron elementos",
  action,
}) => {
  return (
    <Alert variant="info" className="text-center py-5">
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
      <Alert.Heading>{title}</Alert.Heading>
      <p className="mb-3">{message}</p>

      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Alert>
  );
};

export default EmptyState;
