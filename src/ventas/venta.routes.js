const express = require("express");
const {
  crearVenta,
  agregarProductoVenta,
  traerVentas,
  traerVentaPorId,
  modificarVentaPorId,
  eliminarVentaPorId,
  registrarVentaAPI, 
<<<<<<< HEAD
  exportarExcelVentas // <-- Importamos la función de Excel
=======
  exportarExcelVentas 
>>>>>>> front
} = require("./venta.controller");

const ventaRouter = express.Router();

ventaRouter.post("/", registrarVentaAPI);

// BARRERA: Todo lo de abajo requiere estar logueado
ventaRouter.use(require("../middleware/autenticacion").protegerRuta);

ventaRouter.get("/exportar/excel", exportarExcelVentas);
ventaRouter.get("/", traerVentas);
ventaRouter.post("/basico", crearVenta); 
ventaRouter.post("/producto", agregarProductoVenta);

// IMPORTANTE: La ruta de exportar va ACÁ, antes de /:id
ventaRouter.get("/exportar/excel", exportarExcelVentas);

ventaRouter.get("/:id", traerVentaPorId);
ventaRouter.put("/:id", modificarVentaPorId);
ventaRouter.delete("/:id", eliminarVentaPorId);

module.exports = ventaRouter;