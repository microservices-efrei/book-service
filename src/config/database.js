const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'database-postgres', // Utilise 'postgres' dans Docker Compose
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'book_db',
  logging: false, // Désactive les logs SQL dans la console
});

module.exports = sequelize;
