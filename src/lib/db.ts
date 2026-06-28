import mysql from 'mysql2/promise';

// Initialize a connection pool to XAMPP MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'rbac_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
