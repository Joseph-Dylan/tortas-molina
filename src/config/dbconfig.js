import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const config = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

config.getConnection((err) => {
    if (err) {
        console.error('Error en la conexión a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa.');
    connection.release();
});

export default config;
