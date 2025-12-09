// src/controllers/productController.js
import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default getProducts;