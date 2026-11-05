const express = require('express');
const path = require('path');

const rutasProductos = require('./routes/rutasProductos');
const rutasUsuarios = require('./routes/rutasUsuarios');
const rutasVentas = require('./routes/rutasVentas');
const manejadorErrores = require('./middlewares/errores');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Enlazamos las rutas creadas
app.use(rutasProductos);
app.use(rutasUsuarios);
app.use(rutasVentas);

// Middleware global de errores al final
app.use(manejadorErrores);

module.exports = app;