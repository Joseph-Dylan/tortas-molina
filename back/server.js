const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "🐐🐐🐐 API de Tortas Molina la Güera funcionando 🐐🐐🐐",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/*",
      productos: "/api/productos/*",
      carrito: "/api/carrito/*",
      ventas: "/api/ventas/*",
    },
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 Base de datos: ${process.env.DB_NAME}`);
});
