const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const ProductoVentas = sequelize.define(
  "ProductoVentas",
  {
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    precio_historico: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "productos_ventas",
    timestamps: false,
  }
);

module.exports = ProductoVentas;