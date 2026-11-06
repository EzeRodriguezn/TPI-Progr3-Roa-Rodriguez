const { Sequelize } = require('sequelize');

// Parámetros: 'nombre_de_la_bd', 'usuario', 'contraseña'
const sequelize = new Sequelize("mysql://root:123456@localhost:3306/'TPI'" );

module.exports = sequelize;