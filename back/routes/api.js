const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Importar controladores
const authController = require("../controllers/authController");
const productoController = require("../controllers/productoController");
const carritoController = require("../controllers/carritoController");
const ventaController = require("../controllers/ventaController");

// ==========================================
// MIDDLEWARE DE AUTENTICACIÓN
// ==========================================
const autenticar = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Acceso no autorizado. Token requerido." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// ==========================================
// RUTAS DE AUTENTICACIÓN (PÚBLICAS)
// ==========================================
router.post("/register", authController.registrar);
router.post("/login", authController.login);
router.post("/logout", authController.logout); // Opcional pero recomendable

// ==========================================
// RUTAS DE PERFIL (PROTEGIDAS)
// ==========================================
router.get("/profile", autenticar, authController.perfil);
router.put("/profile", autenticar, authController.actualizarPerfil);

// ==========================================
// RUTAS DE PRODUCTOS (PÚBLICAS)
// ==========================================
router.get("/productos", productoController.obtenerProductos);
router.get("/productos/buscar", productoController.buscarProductos);
router.get("/productos/:id", productoController.obtenerProducto);

// ==========================================
// RUTAS DE CARRITO (PROTEGIDAS)
// ==========================================
router.post("/carrito/agregar", autenticar, carritoController.agregarAlCarrito);
router.get("/carrito", autenticar, carritoController.obtenerCarrito);
router.put(
  "/carrito/:productoId",
  autenticar,
  carritoController.actualizarCantidad
);
router.delete(
  "/carrito/:productoId",
  autenticar,
  carritoController.eliminarDelCarrito
);
router.delete("/carrito", autenticar, carritoController.vaciarCarrito);

// ==========================================
// RUTAS DE VENTAS/COMPRAS (PROTEGIDAS)
// ==========================================
router.post("/comprar", autenticar, ventaController.crearVenta);
router.get("/mis-compras", autenticar, ventaController.obtenerCompras);
router.get("/compras/:id", autenticar, ventaController.obtenerDetalleVenta);

module.exports = router;
