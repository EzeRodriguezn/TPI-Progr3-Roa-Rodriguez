const { Sequelize } = require('sequelize');

// Parámetros: 'nombre_de_la_bd', 'usuario', 'contraseña'
const sequelize = new Sequelize("mysql://root:526481200@localhost:3306/TPI" );

module.exports = sequelize;

//node src/main.js