require('dotenv').config();
const base = {
  username: process.env.DB_USER || 'store',
  password: process.env.DB_PASSWORD || 'store',
  database: process.env.DB_NAME || 'store',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  migrationStorageTableName: 'SequelizeMeta'
};
module.exports = { development: base, test: base, production: base };
