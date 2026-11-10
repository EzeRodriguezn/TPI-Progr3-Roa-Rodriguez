const path = require("path");
const { Sequelize } = require("sequelize");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const DB_PORT = Number(process.env.DB_PORT || 3306);

if (!DB_HOST || !DB_NAME || !DB_USER || !Number.isInteger(DB_PORT) ||
    DB_PORT <= 0 || DB_PORT > 65535) {
  throw new Error("ConfigurÃ¡ DB_HOST, DB_PORT, DB_NAME y DB_USER en el archivo .env");
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD || "", {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
});

module.exports = sequelize;