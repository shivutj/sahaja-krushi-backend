const path = require('path');
const { Sequelize } = require('sequelize');

// Load env from backend root
try {
  const envPath = path.resolve(__dirname, '../../.env');
  require('dotenv').config({ path: envPath });
} catch (_) {
  require('dotenv').config();
}

const {
  DATABASE_URL,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_DB,
  MYSQL_PWD,
} = process.env;

let sequelize;

if (DATABASE_URL) {
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
} else {
  // Provide a helpful error if env is missing
  throw new Error(
    'Database environment variables missing. Provide either DATABASE_URL or MYSQL_HOST, MYSQL_USER, MYSQL_DB (and optional MYSQL_PWD, MYSQL_PORT).'
  );
}

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('[DB] Connection has been established successfully.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[DB] Unable to connect to the database:', error.message);
    throw error;
  }
}

module.exports = {
  sequelize,
  connectToDatabase,
};
