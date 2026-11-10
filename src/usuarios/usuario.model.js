const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "admin",
    },
  },
  {
    tableName: "usuarios",
  }
);

module.exports = Usuario;