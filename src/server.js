import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Para usar __dirname con ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve archivos estáticos de React desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../../public')));

// Tus rutas de API
app.use('/api/products', productRoutes); // Cambié esto para mejor estructura

// Para React Router: todas las rutas no-API van a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});