const dotenv = require('dotenv');

dotenv.config();

const common = {
  dialect: 'mysql',
  logging: false,
};

function fromEnv() {
  const {
    DATABASE_URL,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_DB,
    MYSQL_PWD,
  } = process.env;

  if (DATABASE_URL) {
    return { ...common, use_env_variable: 'DATABASE_URL' };
  }

  return {
    ...common,
    username: MYSQL_USER,
    password: MYSQL_PWD || '',
    database: MYSQL_DB,
    host: MYSQL_HOST,
    port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
  };
}

module.exports = {
  development: fromEnv(),
  test: fromEnv(),
  production: fromEnv(),
};
