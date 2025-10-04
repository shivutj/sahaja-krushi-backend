'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
// Ensure we load .env from the backend root explicitly
try {
  const envPath = path.resolve(__dirname, '../../.env');
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: envPath });
} catch (_) {
  // fallback to default
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
let fileConfig;
try {
  // Prefer JS config (env-driven); fallback to JSON for legacy
  // eslint-disable-next-line import/no-dynamic-require, global-require
  fileConfig = require(__dirname + '/../config/config.js')[env];
} catch (e) {
  fileConfig = require(__dirname + '/../config/config.json')[env];
}
const db = {};

let sequelize;
// Prefer environment variables if provided, else fall back to config.json
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_DB,
  MYSQL_PWD,
  DATABASE_URL,
} = process.env;

if (DATABASE_URL) {
  // Support single connection string if present
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
  });
} else if (MYSQL_HOST && MYSQL_USER && MYSQL_DB) {
  sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD || '', {
    host: MYSQL_HOST,
    port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
    dialect: 'mysql',
    logging: false,
  });
} else if (fileConfig && fileConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[fileConfig.use_env_variable], fileConfig);
} else {
  if (!(MYSQL_HOST && MYSQL_USER && MYSQL_DB)) {
    // Helpful hint if env is incomplete
    // eslint-disable-next-line no-console
    console.warn('[DB] Env variables missing (need MYSQL_HOST, MYSQL_USER, MYSQL_DB). Falling back to config.json');
  }
  sequelize = new Sequelize(
    fileConfig.database,
    fileConfig.username,
    fileConfig.password,
    fileConfig
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
