const dotenv = require ("dotenv");

dotenv.config({ silent: true });

module.exports = {
    PORT : process.env.PORT|| 3000
}