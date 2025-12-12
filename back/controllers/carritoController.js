const pool = require("../config/database");

// Agregar al carrito
exports.agregarAlCarrito = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;
    const usuarioId = req.userId;

    if (!productoId) {
      console.log("Producto no proporcionado");
      return res.status(400).json({ error: "Producto no proporcionado" });
    }

    if (!usuarioId) {
      console.log("Usuario no proporcionado");
      return res.status(401).json({ error: "Usuario no autorizado" });
    }

    // Verificar producto
    const [productos] = await pool.execute(
      "SELECT id, stock, precio FROM productos WHERE id = ?",
      [productoId]
    );

    if (productos.length === 0) {
      console.log("Producto no encontrado");
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const producto = productos[0];

    // Verificar stock
    if (producto.stock < (cantidad || 1)) {
      console.log("Stock insuficiente");
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    // Verificar si ya está en el carrito
    const [existentes] = await pool.execute(
      "SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?",
      [usuarioId, productoId]
    );

    if (existentes.length > 0) {
      console.log("Producto existente, actualizando cantidad");
      // Actualizar cantidad
      const nuevaCantidad = existentes[0].cantidad + (cantidad || 1);
      await pool.execute("UPDATE carrito SET cantidad = ? WHERE id = ?", [
        nuevaCantidad,
        existentes[0].id,
      ]);
    } else {
      // Agregar nuevo
      await pool.execute(
        "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)",
        [usuarioId, productoId, cantidad || 1]
      );
    }

    res.json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error agregando al carrito:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener carrito
exports.obtenerCarrito = async (req, res) => {
  try {
    const [items] = await pool.execute(
      `
      SELECT c.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.usuario_id = ?
    `,
      [req.userId]
    );

    // Calcular total
    let total = 0;
    items.forEach((item) => {
      total += item.precio * item.cantidad;
    });
    console.log("Items: ", items);
    console.log("Total: ", total);

    res.json({ items, total: total.toFixed(2) });
  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Actualizar cantidad en carrito
exports.actualizarCantidad = async (req, res) => {
  try {
    const { productoId } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }

    if (!productoId) {
      return res.status(400).json({ error: "Producto no proporcionado" });
    }

    // Verificar stock
    const [productos] = await pool.execute(
      "SELECT stock FROM productos WHERE id = ?",
      [productoId]
    );

    if (productos.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (productos[0].stock < cantidad) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    const [result] = await pool.execute(
      "UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?",
      [cantidad, req.userId, productoId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    res.json({ message: "Cantidad actualizada" });
  } catch (error) {
    console.error("Error actualizando cantidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Eliminar del carrito
exports.eliminarDelCarrito = async (req, res) => {
  try {
    const { productoId } = req.params;
    console.log("Producto a eliminar: ", productoId);

    if (!productoId) {
      return res.status(400).json({ error: "Producto no proporcionado" });
    }

    const [result] = await pool.execute(
      "DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?",
      [req.userId, productoId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }
    console.log("Producto eliminado del carrito exitosamente");
    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error("Error eliminando del carrito:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Vaciar carrito
exports.vaciarCarrito = async (req, res) => {
  try {
    console.log("Limpiando el carrito...");
    await pool.execute("DELETE FROM carrito WHERE usuario_id = ?", [
      req.userId,
    ]);

    res.json({ message: "Carrito vaciado" });
  } catch (error) {
    console.error("Error vaciando carrito:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
