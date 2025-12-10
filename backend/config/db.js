const { Sequelize } = require('sequelize');

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '5432',
  DB_NAME = 'CarpetStore',
  DB_USER = 'postgres',
  DB_PASS = '1325',
  DB_DIALECT = 'postgres',
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { sequelize };
