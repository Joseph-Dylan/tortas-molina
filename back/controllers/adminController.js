const pool = require("../config/database");

// ==========================================
// GESTIÓN DE PRODUCTOS (ADMIN)
// ==========================================

// Crear nuevo producto
exports.crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      categoria_id,
      imagen_url,
      stock,
      ingredientes,
      peso_kg,
    } = req.body;

    // Validaciones básicas
    if (!nombre || !precio) {
      return res.status(400).json({
        error: "Nombre y precio son requeridos",
      });
    }

    if (precio <= 0) {
      return res.status(400).json({
        error: "El precio debe ser mayor a 0",
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        error: "El stock debe ser mayor o igual a 0",
      });
    }

    // Insertar producto
    const [result] = await pool.execute(
      `INSERT INTO productos 
       (nombre, descripcion, precio, categoria_id, imagen_url, stock, ingredientes, peso_kg) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion || null,
        precio,
        categoria_id || null,
        "/imagenes-tortas/torta-default.jpg",
        stock || 0,
        ingredientes || null,
        peso_kg || 0.5,
      ]
    );

    // Obtener producto creado
    const [productos] = await pool.execute(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p 
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Producto creado exitosamente",
      producto: productos[0],
    });
  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      precio,
      categoria_id,
      imagen_url,
      stock,
      ingredientes,
      peso_kg,
    } = req.body;

    // Verificar que el producto existe
    const [productoExistente] = await pool.execute(
      "SELECT id FROM productos WHERE id = ?",
      [id]
    );

    if (productoExistente.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Actualizar producto
    await pool.execute(
      `UPDATE productos SET 
        nombre = COALESCE(?, nombre),
        descripcion = COALESCE(?, descripcion),
        precio = COALESCE(?, precio),
        categoria_id = COALESCE(?, categoria_id),
        imagen_url = COALESCE(?, imagen_url),
        stock = COALESCE(?, stock),
        ingredientes = COALESCE(?, ingredientes),
        peso_kg = COALESCE(?, peso_kg)
       WHERE id = ?`,
      [
        nombre,
        descripcion,
        precio,
        categoria_id,
        imagen_url,
        stock,
        ingredientes,
        peso_kg,
        id,
      ]
    );

    // Obtener producto actualizado
    const [productos] = await pool.execute(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p 
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    res.json({
      message: "Producto actualizado exitosamente",
      producto: productos[0],
    });
  } catch (error) {
    console.error("Error actualizando producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // Verificar que el producto existe
    const [productoExistente] = await connection.execute(
      "SELECT id FROM productos WHERE id = ?",
      [id]
    );

    if (productoExistente.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar si hay ventas asociadas
    const [ventasAsociadas] = await connection.execute(
      "SELECT COUNT(*) as count FROM venta_items WHERE producto_id = ?",
      [id]
    );

    if (ventasAsociadas[0].count > 0) {
      await connection.rollback();
      return res.status(400).json({
        error:
          "No se puede eliminar el producto porque tiene ventas asociadas. Use 'stock = 0' en su lugar.",
      });
    }

    // Eliminar del carrito si existe
    await connection.execute("DELETE FROM carrito WHERE producto_id = ?", [id]);

    // Eliminar producto
    await connection.execute("DELETE FROM productos WHERE id = ?", [id]);

    await connection.commit();
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    await connection.rollback();
    console.error("Error eliminando producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  } finally {
    connection.release();
  }
};

// ==========================================
// GESTIÓN DE VENTAS (ADMIN)
// ==========================================

// Obtener todas las ventas
exports.obtenerTodasVentas = async (req, res) => {
  try {
    const [ventas] = await pool.execute(`
      SELECT v.*, u.nombre as usuario_nombre, u.email,
        COUNT(vi.id) as total_items,
        SUM(vi.cantidad) as total_productos
      FROM ventas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      LEFT JOIN venta_items vi ON v.id = vi.venta_id
      GROUP BY v.id
      ORDER BY v.fecha_pedido DESC
    `);
    res.json(ventas);
  } catch (error) {
    console.error("Error obteniendo ventas:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Crear venta manualmente (admin)
exports.crearVentaManual = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { usuario_id, items, metodo_pago, notas, estado } = req.body;

    // Validaciones
    if (!usuario_id || !items || !Array.isArray(items) || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: "Datos de venta inválidos" });
    }

    // Verificar que el usuario existe
    const [usuario] = await connection.execute(
      "SELECT id FROM usuarios WHERE id = ?",
      [usuario_id]
    );

    if (usuario.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Calcular total y verificar stock
    let total = 0;
    for (const item of items) {
      const [producto] = await connection.execute(
        "SELECT precio, stock, nombre FROM productos WHERE id = ?",
        [item.producto_id]
      );

      if (producto.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          error: `Producto ${item.producto_id} no encontrado`,
        });
      }

      if (producto[0].stock < item.cantidad) {
        await connection.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para ${producto[0].nombre}. Disponible: ${producto[0].stock}`,
        });
      }

      total += producto[0].precio * item.cantidad;
    }

    // Crear venta
    const [ventaResult] = await connection.execute(
      `INSERT INTO ventas 
       (usuario_id, total, metodo_pago, notas, estado) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        usuario_id,
        total,
        metodo_pago || "efectivo",
        notas || "",
        estado || "pagado",
      ]
    );
    const ventaId = ventaResult.insertId;

    // Crear items y actualizar stock
    for (const item of items) {
      const [producto] = await connection.execute(
        "SELECT precio FROM productos WHERE id = ?",
        [item.producto_id]
      );

      const subtotal = producto[0].precio * item.cantidad;

      await connection.execute(
        `INSERT INTO venta_items 
         (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
         VALUES (?, ?, ?, ?, ?)`,
        [ventaId, item.producto_id, item.cantidad, producto[0].precio, subtotal]
      );

      // Actualizar stock
      await connection.execute(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [item.cantidad, item.producto_id]
      );
    }

    await connection.commit();

    // Obtener venta creada con detalles
    const [ventaCreada] = await pool.execute(
      `
      SELECT v.*, u.nombre as usuario_nombre, u.email
      FROM ventas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      WHERE v.id = ?
    `,
      [ventaId]
    );

    res.status(201).json({
      message: "Venta creada exitosamente",
      venta: ventaCreada[0],
      total,
      items: items.length,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creando venta manual:", error);
    res.status(500).json({ error: "Error al crear venta" });
  } finally {
    connection.release();
  }
};

// Actualizar estado de venta
exports.actualizarEstadoVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, fecha_entrega } = req.body;

    const estadosValidos = [
      "pendiente",
      "pagado",
      "en_preparacion",
      "entregado",
      "cancelado",
    ];

    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    // Construir query dinámica
    let query = "UPDATE ventas SET ";
    const params = [];

    if (estado) {
      query += "estado = ?";
      params.push(estado);
    }

    if (fecha_entrega) {
      if (estado) query += ", ";
      query += "fecha_entrega = ?";
      params.push(fecha_entrega);
    }

    query += " WHERE id = ?";
    params.push(id);

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.json({
      message: "Estado de venta actualizado exitosamente",
      estado,
      fecha_entrega,
    });
  } catch (error) {
    console.error("Error actualizando estado de venta:", error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
};

// Eliminar venta (solo si está pendiente o cancelada)
exports.eliminarVenta = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // Verificar que la venta existe y está en estado permitido
    const [venta] = await connection.execute(
      "SELECT estado FROM ventas WHERE id = ?",
      [id]
    );

    if (venta.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Solo permitir eliminar ventas pendientes o canceladas
    if (!["pendiente", "cancelado"].includes(venta[0].estado)) {
      await connection.rollback();
      return res.status(400).json({
        error: "Solo se pueden eliminar ventas pendientes o canceladas",
      });
    }

    // Obtener items de la venta para restaurar stock (solo si no está cancelada)
    if (venta[0].estado !== "cancelado") {
      const [items] = await connection.execute(
        "SELECT producto_id, cantidad FROM venta_items WHERE venta_id = ?",
        [id]
      );

      // Restaurar stock
      for (const item of items) {
        await connection.execute(
          "UPDATE productos SET stock = stock + ? WHERE id = ?",
          [item.cantidad, item.producto_id]
        );
      }
    }

    // Eliminar items de venta
    await connection.execute("DELETE FROM venta_items WHERE venta_id = ?", [
      id,
    ]);

    // Eliminar venta
    const [result] = await connection.execute(
      "DELETE FROM ventas WHERE id = ?",
      [id]
    );

    await connection.commit();
    res.json({ message: "Venta eliminada exitosamente" });
  } catch (error) {
    await connection.rollback();
    console.error("Error eliminando venta:", error);
    res.status(500).json({ error: "Error al eliminar venta" });
  } finally {
    connection.release();
  }
};

// Obtener detalle completo de una venta
exports.obtenerDetalleVentaCompleto = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener información de la venta
    const [ventas] = await pool.execute(
      `
      SELECT v.*, u.nombre as usuario_nombre, u.email, u.telefono, u.direccion
      FROM ventas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      WHERE v.id = ?
    `,
      [id]
    );

    if (ventas.length === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Obtener items de la venta
    const [items] = await pool.execute(
      `
      SELECT vi.*, p.nombre, p.imagen_url, p.descripcion
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

// ==========================================
// GESTIÓN DE CATEGORÍAS (ADMIN)
// ==========================================

// Obtener todas las categorías (para formularios)
exports.obtenerCategorias = async (req, res) => {
  try {
    const [categorias] = await pool.execute(
      "SELECT * FROM categorias ORDER BY nombre"
    );
    res.json(categorias);
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Crear categoría
exports.crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "Nombre es requerido" });
    }

    const [result] = await pool.execute(
      "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion || null]
    );

    res.status(201).json({
      message: "Categoría creada exitosamente",
      categoria: { id: result.insertId, nombre, descripcion },
    });
  } catch (error) {
    console.error("Error creando categoría:", error);
    res.status(500).json({ error: "Error al crear categoría" });
  }
};
