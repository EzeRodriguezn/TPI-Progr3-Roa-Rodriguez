const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

// ==========================================
// RUTAS API (JSON)
// ==========================================
// Registrar una compra finalizada
router.post('/api/ventas', ventasController.registrarVenta);

// Obtener el ticket de una venta por ID
router.get('/api/ventas/:id/ticket', ventasController.obtenerTicket);

// ==========================================
// RUTAS BACKOFFICE (EJS / Descarga)
// ==========================================
// Listar todas las ventas registradas
router.get('/admin/ventas', ventasController.mostrarVentasAdmin);

// Descargar reporte de ventas en archivo Excel
router.get('/admin/ventas/excel', ventasController.descargarExcel);

module.exports = router;