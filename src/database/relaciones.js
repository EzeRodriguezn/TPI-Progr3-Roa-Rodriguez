// 1. Importamos la instancia de conexión a la base de datos
const sequelize = require('./sequelize');

// 2. Importamos e inicializamos los modelos desde sus respectivos módulos
const Producto = require('../productos/producto.model')(sequelize);
const Venta = require('../ventas/venta.model')(sequelize);
const Usuario = require('../usuarios/usuario.model')(sequelize);

// (Opcional) Si configuraste el modelo intermedio explícitamente:
// const ProductoVenta = require('./ProductosVentas-model')(sequelize);

// 3. Definimos las relaciones (Muchos a Muchos)
// Si no usás el archivo ProductosVentas-model.js, Sequelize crea la tabla 'producto_venta' automáticamente
Producto.belongsToMany(Venta, { through: 'producto_venta', timestamps: false });
Venta.belongsToMany(Producto, { through: 'producto_venta', timestamps: false });

// 4. Exportamos los modelos y la conexión listos para usar en los controladores
module.exports = {
    sequelize,
    Producto,
    Venta,
    Usuario
};