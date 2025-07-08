// db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'virtual_assistant',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;