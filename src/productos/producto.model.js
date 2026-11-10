const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    categoria: {
      type: DataTypes.STRING,
    },
    subcategoria: {
      type: DataTypes.STRING,
    },
    imagen: {
      type: DataTypes.STRING,
      defaultValue: 'default.png', // Por si alguna vez se carga sin imagen
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Todos los productos nacen activos por defecto
    }
  },
  {
    tableName: "productos",
  }
);

module.exports = Producto;