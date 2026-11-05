const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// ==========================================
// RUTAS DE AUTENTICACIÓN Y ADMIN
// ==========================================
// Mostrar el formulario de Login (EJS)
router.get('/admin/login', usuariosController.mostrarLogin);

// Procesar inicio de sesión
router.post('/admin/login', usuariosController.procesarLogin);

// Cerrar sesión
router.get('/admin/logout', usuariosController.cerrarSesion);

module.exports = router;