const Usuario = require("../usuarios/usuario.model");
const Venta = require("../ventas/venta.model");
const Producto = require("../productos/producto.model");
const sequelize = require("./sequelize");
<<<<<<< HEAD
const ProductoVentas = require("./ProductoVentas.model");
=======
const ProductoVentas = require("./ProductosVentas.model");
>>>>>>> develop

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
<<<<<<< HEAD
  await sequelize.sync({ alter: true });
=======
  await sequelize.sync();
>>>>>>> develop
}

syncMuchos();

module.exports = {
  Usuario,
  Venta,
  Producto,
  ProductoVentas,
};