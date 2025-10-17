const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1', 
  port: process.env.DB_PORT ||  5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '123456',
  database: process.env.DB_NAME || 'postgres',
  max: 20, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000, 
  maxUses: 7500,
});
module.exports = pool;