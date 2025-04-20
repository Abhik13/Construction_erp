require('dotenv').config(); // Load environment variables from .env
const mysql = require('mysql2');

// Create a MySQL connection using env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // e.g., 'localhost'
  user: process.env.DB_USER,       // e.g., 'app_user'
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME    // e.g., 'erp'
});

// Connect to the database and handle any connection errors
db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    process.exit(1); // Stop the app if DB connection fails
  }
  console.log('Connected to MySQL database');
});

module.exports = db;

