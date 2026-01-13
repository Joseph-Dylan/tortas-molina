import React from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * Modal de confirmación reutilizable
 * @param {boolean} show - Mostrar u ocultar
 * @param {function} onHide - Función para cerrar
 * @param {function} onConfirm - Función al confirmar
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje de confirmación
 * @param {string} confirmText - Texto del botón confirmar
 * @param {string} cancelText - Texto del botón cancelar
 * @param {string} variant - Variante del botón (danger, warning, success)
 */
const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = "¿Confirmar acción?",
  message = "¿Estás seguro de realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
