require('dotenv').config();
const { DataSource } = require('typeorm');
const path = require('path');

// Conversión más robusta a booleano
const ssl = process.env.DATABASE_SSL === 'true' || 
            process.env.DATABASE_SSL === '1' ||
            process.env.DATABASE_URL?.includes('sslmode=require');

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production', 
  entities: [path.join(__dirname, "../entities/*.js")],
  ssl: ssl ? { rejectUnauthorized: false } : false,
});

module.exports = AppDataSource;