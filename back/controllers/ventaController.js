const pool = require("../config/database");

// Crear venta (comprar)
exports.crearVenta = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { metodo_pago, notas } = req.body;
    const usuarioId = req.userId;

    if (!metodo_pago) {
      await connection.rollback();
      return res.status(400).json({ error: "Metodo de pago no proporcionado" });
    }

    if (!usuarioId) {
      await connection.rollback();
      return res.status(401).json({ error: "Usuario no autorizado" });
    }

    // Obtener items del carrito
    const [carritoItems] = await connection.execute(
      `
      SELECT c.*, p.precio, p.stock, p.nombre
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.usuario_id = ?
    `,
      [usuarioId]
    );

    if (carritoItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    // Calcular total y verificar stock
    let total = 0;
    for (const item of carritoItems) {
      if (item.stock < item.cantidad) {
        await connection.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para ${item.nombre}. Disponible: ${item.stock}`,
        });
      }
      total += item.precio * item.cantidad;
    }

    // Crear venta
    const [ventaResult] = await connection.execute(
      "INSERT INTO ventas (usuario_id, total, metodo_pago, notas) VALUES (?, ?, ?, ?)",
      [usuarioId, total, metodo_pago || "efectivo", notas || ""]
    );
    const ventaId = ventaResult.insertId;

    // Crear items de venta y actualizar stock
    for (const item of carritoItems) {
      const subtotal = item.precio * item.cantidad;

      await connection.execute(
        "INSERT INTO venta_items (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
        [ventaId, item.producto_id, item.cantidad, item.precio, subtotal]
      );

      // Actualizar stock
      await connection.execute(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [item.cantidad, item.producto_id]
      );
    }

    // Vaciar carrito
    await connection.execute("DELETE FROM carrito WHERE usuario_id = ?", [
      usuarioId,
    ]);

    await connection.commit();

    res.json({
      message: "Compra realizada exitosamente",
      ventaId,
      total: total.toFixed(2),
      items: carritoItems.length,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creando venta:", error);
    res.status(500).json({ error: "Error al procesar la compra" });
  } finally {
    connection.release();
  }
};

// Obtener historial de compras
exports.obtenerCompras = async (req, res) => {
  try {
    const [ventas] = await pool.execute(
      `
      SELECT v.*, 
        COUNT(vi.id) as total_items,
        SUM(vi.cantidad) as total_productos
      FROM ventas v
      LEFT JOIN venta_items vi ON v.id = vi.venta_id
      WHERE v.usuario_id = ?
      GROUP BY v.id
      ORDER BY v.fecha_pedido DESC
    `,
      [req.userId]
    );

    res.json(ventas);
  } catch (error) {
    console.error("Error obteniendo compras:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener detalle de una venta
exports.obtenerDetalleVenta = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id de venta no proporcionado" });
    }

    // Verificar que la venta pertenezca al usuario
    const [ventas] = await pool.execute(
      "SELECT * FROM ventas WHERE id = ? AND usuario_id = ?",
      [id, req.userId]
    );

    if (ventas.length === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Obtener items de la venta
    const [items] = await pool.execute(
      `
      SELECT vi.*, p.nombre, p.imagen_url
      FROM venta_items vi
      JOIN productos p ON vi.producto_id = p.id
      WHERE vi.venta_id = ?
    `,
      [id]
    );

    res.json({
      venta: ventas[0],
      items,
    });
  } catch (error) {
    console.error("Error obteniendo detalle de venta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
