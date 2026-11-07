const Usuario = require("../usuarios/usuario.model");
const Venta = require("../ventas/venta.model");
const Producto = require("../productos/producto.model");
const sequelize = require("./sequelize");
const ProductoVentas = require("./ProductosVentas.model");

// UNO A MUCHOS (Un Usuario/Cajero registra muchas Ventas)
Usuario.hasMany(Venta, {
  foreignKey: "idUsuario",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Venta.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// MUCHO A MUCHOS (Ventas y Productos a través de la tabla intermedia ProductoVentas)
Venta.belongsToMany(Producto, { through: ProductoVentas });
Producto.belongsToMany(Venta, { through: ProductoVentas });

async function syncMuchos() {
  await sequelize.sync();
}

syncMuchos();

module.exports = {
  Usuario,
  Venta,
  Producto,
  ProductoVentas,
};