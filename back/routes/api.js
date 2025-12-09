const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Importar controladores
const authController = require('../controllers/authController');
const productoController = require('../controllers/productoController');
const carritoController = require('../controllers/carritoController');
const ventaController = require('../controllers/ventaController');

// Middleware de autenticación
const autenticar = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado. Token requerido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Rutas de autenticación (públicas)
router.post('/auth/registrar', authController.registrar);
router.post('/auth/login', authController.login);

// Rutas de perfil (protegidas)
router.get('/auth/perfil', autenticar, authController.perfil);
router.put('/auth/perfil', autenticar, authController.actualizarPerfil);

// Rutas de productos (públicas)
router.get('/productos', productoController.obtenerProductos);
router.get('/productos/:id', productoController.obtenerProducto);
router.get('/productos/buscar', productoController.buscarProductos);
router.get('/categorias', productoController.obtenerCategorias);

// Rutas de carrito (protegidas)
router.post('/carrito/agregar', autenticar, carritoController.agregarAlCarrito);
router.get('/carrito', autenticar, carritoController.obtenerCarrito);
router.put('/carrito/:productoId', autenticar, carritoController.actualizarCantidad);
router.delete('/carrito/:productoId', autenticar, carritoController.eliminarDelCarrito);
router.delete('/carrito', autenticar, carritoController.vaciarCarrito);

// Rutas de ventas (protegidas)
router.post('/ventas/comprar', autenticar, ventaController.crearVenta);
router.get('/ventas', autenticar, ventaController.obtenerCompras);
router.get('/ventas/:id', autenticar, ventaController.obtenerDetalleVenta);

module.exports = router;