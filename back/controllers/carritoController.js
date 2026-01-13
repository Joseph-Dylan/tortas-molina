const pool = require("../config/database");

// Agregar al carrito
exports.agregarAlCarrito = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;
    const usuarioId = req.userId;

    const cantidadFinal = parseInt(cantidad) || 1;

    if (cantidadFinal < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser al menos 1' });
    }

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
      'SELECT id, stock, precio FROM productos WHERE id = ?',
      [productoId]
    );

    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const producto = productos[0];

    // Verificar stock
    if (producto.stock < cantidadFinal) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${producto.stock}` });
    }

    // Verificar si ya está en el carrito
    const [existentes] = await pool.execute(
      'SELECT id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?',
      [usuarioId, productoId]
    );

    if (existentes.length > 0) {
      // Sumar cantidad existente
      const nuevaCantidad = existentes[0].cantidad + cantidadFinal;
      await pool.execute(
        'UPDATE carrito SET cantidad = ? WHERE id = ?',
        [nuevaCantidad, existentes[0].id]
      );
    } else {
      // Agregar nuevo
      await pool.execute(
        'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [usuarioId, productoId, cantidadFinal]
      );
    }

    res.json({ 
      message: `Producto agregado al carrito (cantidad: ${cantidadFinal})`,
      cantidad: cantidadFinal
    });
  } catch (error) {
    console.error('Error agregando al carrito:', error);
    res.status(500).json({ error: 'Error en el servidor' });
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
    const { cantidad } = req.body; // Opcional: cantidad a eliminar

    if (!productoId) {
      return res.status(400).json({ error: 'Producto no proporcionado' });
    }

    if (cantidad) {
      // Eliminar cantidad específica
      const [item] = await pool.execute(
        'SELECT cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?',
        [req.userId, productoId]
      );

      if (item.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }

      const nuevaCantidad = item[0].cantidad - cantidad;
      
      if (nuevaCantidad <= 0) {
        // Eliminar completamente si la cantidad es 0 o menos
        await pool.execute(
          'DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?',
          [req.userId, productoId]
        );
      } else {
        // Actualizar cantidad
        await pool.execute(
          'UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?',
          [nuevaCantidad, req.userId, productoId]
        );
      }
    } else {
      // Eliminar completamente
      const [result] = await pool.execute(
        'DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?',
        [req.userId, productoId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }
    }

    res.json({ message: 'Producto actualizado en el carrito' });
  } catch (error) {
    console.error('Error eliminando del carrito:', error);
    res.status(500).json({ error: 'Error en el servidor' });
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
