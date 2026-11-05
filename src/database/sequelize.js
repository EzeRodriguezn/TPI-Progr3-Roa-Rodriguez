const { Sequelize } = require('sequelize');

// Parámetros: 'nombre_de_la_bd', 'usuario', 'contraseña'
const sequelize = new Sequelize("'TPI-Roa-Rodriguez,'root','526481200'," 
    // host: 'localhost',
    // dialect: 'mysql',
   
);

module.exports = sequelize;