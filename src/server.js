import express from 'express';
import path from 'path';
import cors from 'cors';

import productRoutes from './routes/productroutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', productRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});