// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Or provide CA cert
  },

});

// pool.connect()
//   .then(() => console.log('✅ Connected to PostgreSQL'))
//   .catch((err) => console.error('❌ Database connection error:', err));

module.exports = pool;
