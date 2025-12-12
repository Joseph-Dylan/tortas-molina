const pool = require("../config/database");

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const [productos] = await pool.execute(`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.created_at DESC
    `);

    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener producto por ID
exports.obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Id del prodcuto a obtener", id);
    const [productos] = await pool.execute(
      `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `,
      [id]
    );

    if (productos.length === 0) {
      console.log("No se encontro el prodcuto con ese id");
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(productos[0]);
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener categorías
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

// Buscar productos
exports.buscarProductos = async (req, res) => {
  try {
    const { query } = req.query;

    const [productos] = await pool.execute(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM productos p 
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.nombre LIKE ? OR p.descripcion LIKE ? 
       ORDER BY p.nombre`,
      [`%${query}%`, `%${query}%`]
    );

    res.json(productos);
  } catch (error) {
    console.error("Error buscando productos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
