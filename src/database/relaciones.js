const Usuario = require("../usuarios/usuario.model");
const Venta = require("../ventas/venta.model");
const Producto = require("../productos/producto.model");
const sequelize = require("./sequelize");
const ProductoVentas = require("./ProductosVentas.model");

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
Venta.belongsToMany(Producto, { through: ProductoVentas });
Producto.belongsToMany(Venta, { through: ProductoVentas });

module.exports = {
  Usuario,
  Venta,
  Producto,
  ProductoVentas,
};
