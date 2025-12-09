import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await config.getConnection();
    console.log('Conexión exitosa');
    connection.release();
  } catch (error) {
    console.error('Error en la conexión a la base de datos:', error.message);
  }
};

// Probar la conexión al iniciar
testConnection();

export default config;