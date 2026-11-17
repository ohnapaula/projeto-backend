const { Sequelize } = require('sequelize');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, { dialect: 'mysql', logging: false })
  : new Sequelize(
      process.env.DB_NAME || 'store',
      process.env.DB_USER || 'store',
      process.env.DB_PASSWORD || 'store',
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false
      }
    );

module.exports = sequelize;
