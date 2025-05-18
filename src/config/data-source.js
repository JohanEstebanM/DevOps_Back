require('dotenv').config();
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [__dirname + "/../entities/*.js"],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

module.exports = AppDataSource;