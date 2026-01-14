const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

// Todas las rutas requieren autenticación y rol admin
router.use(verifyToken, isAdmin);

// ====================
// GESTIÓN DE PRODUCTOS
// ====================
router.post("/productos", adminController.crearProducto);
router.put("/productos/:id", adminController.actualizarProducto);
router.delete("/productos/:id", adminController.eliminarProducto);

// ====================
// GESTIÓN DE VENTAS
// ====================
router.get("/ventas", adminController.obtenerTodasVentas);
router.get("/ventas/:id", adminController.obtenerDetalleVentaCompleto);
router.post("/ventas", adminController.crearVentaManual);
router.put("/ventas/:id/estado", adminController.actualizarEstadoVenta);
router.delete("/ventas/:id", adminController.eliminarVenta);

// ====================
// GESTIÓN DE CATEGORÍAS
// ====================
router.get("/categorias", adminController.obtenerCategorias);
router.post("/categorias", adminController.crearCategoria);

module.exports = router;