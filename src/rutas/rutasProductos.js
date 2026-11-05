const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const subidaArchivos = require('../middlewares/subidaArchivos');

// ==========================================
// RUTAS API (Responden con JSON)
// ==========================================
// Obtener productos paginados
router.get('/api/productos', productosController.obtenerTodos);

// Obtener un producto por ID
router.get('/api/productos/:id', productosController.obtenerPorId);

// ==========================================
// RUTAS BACKOFFICE (Renderizan EJS)
// ==========================================
// Mostrar el listado de productos en el panel
router.get('/admin/productos', productosController.mostrarPanelAdmin);

// Formulario para crear un nuevo producto
router.get('/admin/productos/crear', productosController.mostrarFormularioCrear);

// Crear un nuevo producto (usa el middleware para subir la imagen)
router.post('/admin/productos', subidaArchivos.single('imagen'), productosController.crearProducto);

// Formulario para editar un producto
router.get('/admin/productos/editar/:id', productosController.mostrarFormularioEditar);

// Actualizar un producto existente
router.post('/admin/productos/editar/:id', subidaArchivos.single('imagen'), productosController.actualizarProducto);

// Desactivar un producto (Baja lógica)
router.post('/admin/productos/eliminar/:id', productosController.eliminarProducto);

module.exports = router;