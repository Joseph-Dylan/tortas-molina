import React from "react";
import { Button, Form } from "react-bootstrap";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

/**
 * Item individual del carrito
 * @param {object} item - Item del carrito
 * @param {function} onUpdateQuantity - Función para actualizar cantidad
 * @param {function} onRemove - Función para eliminar
 */
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { producto_id, nombre, precio, cantidad, imagen_url } = item;
  const subtotal = (precio * cantidad).toFixed(2);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(producto_id, newQuantity);
    }
  };

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <img
            src={imagen_url || "https://via.placeholder.com/50"}
            alt={nombre}
            width="50"
            height="50"
            className="me-3 rounded"
            style={{ objectFit: "cover" }}
          />
          <span>{nombre}</span>
        </div>
      </td>

      <td className="align-middle">${Number(precio).toFixed(2)}</td>

      <td className="align-middle">
        <div className="d-flex align-items-center" style={{ width: "150px" }}>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => handleQuantityChange(cantidad - 1)}
            disabled={cantidad <= 1}
          >
            <FaMinus size={12} />
          </Button>

          <Form.Control
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className="mx-2 text-center"
            style={{ width: "60px" }}
          />

          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => handleQuantityChange(cantidad + 1)}
          >
            <FaPlus size={12} />
          </Button>
        </div>
      </td>

      <td className="align-middle">
        <strong className="text-success">${subtotal}</strong>
      </td>

      <td className="align-middle text-center">
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onRemove(producto_id)}
          title="Eliminar producto"
        >
          <FaTrash />
        </Button>
      </td>
    </tr>
  );
};

export default CartItem;
