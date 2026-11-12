const express = require("express");
const {
  crearVenta,
  agregarProductoVenta,
  traerVentas,
  traerVentaPorId,
  modificarVentaPorId,
  eliminarVentaPorId,
  registrarVentaAPI, 
  exportarExcelVentas 
} = require("./venta.controller");

const ventaRouter = express.Router();

ventaRouter.post("/", registrarVentaAPI);

ventaRouter.use(require("../middleware/autenticacion").protegerRuta);

ventaRouter.get("/exportar/excel", exportarExcelVentas);
ventaRouter.get("/", traerVentas);
ventaRouter.post("/basico", crearVenta); 
ventaRouter.post("/producto", agregarProductoVenta);
ventaRouter.get("/:id", traerVentaPorId);
ventaRouter.put("/:id", modificarVentaPorId);
ventaRouter.delete("/:id", eliminarVentaPorId);

module.exports = ventaRouter;