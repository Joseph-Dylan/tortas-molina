const pool = require('../config/database');

// Modelo de Usuario
const Usuario = {
  // Crear usuario
  async create(nombre, email, password, direccion = null, telefono = null) {
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, email, password, direccion, telefono) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, password, direccion, telefono]
    );
    return result.insertId;
  },

  // Buscar por email
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  // Buscar por ID
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, nombre, email, direccion, telefono, created_at FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  // Actualizar usuario
  async update(id, data) {
    const { nombre, direccion, telefono } = data;
    const [result] = await pool.execute(
      'UPDATE usuarios SET nombre = ?, direccion = ?, telefono = ? WHERE id = ?',
      [nombre, direccion, telefono, id]
    );
    return result.affectedRows > 0;
  }
};

// Modelo de Producto
const Producto = {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM productos');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [id]
    );
    return rows[0];
  }
};

// Modelo de Carrito
const Carrito = {
  // Agregar producto al carrito
  async agregarProducto(usuarioId, productoId, cantidad = 1) {
    // Verificar si ya existe en el carrito
    const [existing] = await pool.execute(
      'SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?',
      [usuarioId, productoId]
    );

    if (existing.length > 0) {
      // Actualizar cantidad
      const [result] = await pool.execute(
        'UPDATE carrito SET cantidad = cantidad + ? WHERE usuario_id = ? AND producto_id = ?',
        [cantidad, usuarioId, productoId]
      );
      return result;
    } else {
      // Insertar nuevo
      const [result] = await pool.execute(
        'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [usuarioId, productoId, cantidad]
      );
      return result;
    }
  },

  // Obtener carrito de usuario
  async obtenerCarrito(usuarioId) {
    const [rows] = await pool.execute(`
      SELECT c.*, p.nombre, p.precio, p.imagen_url 
      FROM carrito c 
      JOIN productos p ON c.producto_id = p.id 
      WHERE c.usuario_id = ?
    `, [usuarioId]);
    return rows;
  },

  // Actualizar cantidad
  async actualizarCantidad(usuarioId, productoId, cantidad) {
    const [result] = await pool.execute(
      'UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?',
      [cantidad, usuarioId, productoId]
    );
    return result.affectedRows > 0;
  },

  // Eliminar producto del carrito
  async eliminarProducto(usuarioId, productoId) {
    const [result] = await pool.execute(
      'DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?',
      [usuarioId, productoId]
    );
    return result.affectedRows > 0;
  },

  // Vaciar carrito
  async vaciarCarrito(usuarioId) {
    const [result] = await pool.execute(
      'DELETE FROM carrito WHERE usuario_id = ?',
      [usuarioId]
    );
    return result.affectedRows > 0;
  }
};

// Modelo de Venta
const Venta = {
  async crearVenta(usuarioId, items, total) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Crear venta
      const [ventaResult] = await connection.execute(
        'INSERT INTO ventas (usuario_id, total, estado) VALUES (?, ?, ?)',
        [usuarioId, total, 'completada']
      );
      const ventaId = ventaResult.insertId;

      // Crear items de venta
      for (const item of items) {
        await connection.execute(
          'INSERT INTO venta_items (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [ventaId, item.producto_id, item.cantidad, item.precio]
        );
      }

      // Vaciar carrito
      await connection.execute(
        'DELETE FROM carrito WHERE usuario_id = ?',
        [usuarioId]
      );

      await connection.commit();
      return ventaId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async obtenerVentasUsuario(usuarioId) {
    const [rows] = await pool.execute(`
      SELECT v.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'producto_id', vi.producto_id,
            'nombre', p.nombre,
            'cantidad', vi.cantidad,
            'precio_unitario', vi.precio_unitario
          )
        ) as items
      FROM ventas v
      JOIN venta_items vi ON v.id = vi.venta_id
      JOIN productos p ON vi.producto_id = p.id
      WHERE v.usuario_id = ?
      GROUP BY v.id
      ORDER BY v.fecha_venta DESC
    `, [usuarioId]);
    return rows;
  }
};

module.exports = {
  Usuario,
  Producto,
  Carrito,
  Venta
};