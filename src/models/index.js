const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:123456@localhost:3306/TPI');

const Producto = require('./producto')(sequelize);
const Venta = require('./venta')(sequelize);
const Usuario = require('./usuario')(sequelize);

Producto.belongsToMany(Venta, { through: 'producto_venta', timestamps: false });
Venta.belongsToMany(Producto, { through: 'producto_venta', timestamps: false });


const sincronizarDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Tablas sincronizadas correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

sincronizarDB();

module.exports = {
    sequelize,
    Producto,
    Venta,
    Usuario
};