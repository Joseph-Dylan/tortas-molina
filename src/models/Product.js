// src/models/Product.js
import config from '../config/dbconfig.js';

class Product {
  static async getAll() {
    try {
      const [rows] = await config.query('SELECT * FROM products');
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }
}

export default Product;