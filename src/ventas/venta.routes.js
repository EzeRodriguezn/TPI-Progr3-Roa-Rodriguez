const express = require("express");
const {
  crearVenta,
  agregarProductoVenta,
  traerVentas,
  traerVentaPorId,
  modificarVentaPorId,
  eliminarVentaPorId,
} = require("./venta.controller");

const ventaRouter = express.Router();

ventaRouter.get("/", traerVentas);

ventaRouter.post("/", crearVenta);

// Ruta para agregar productos a la venta (tabla intermedia)
ventaRouter.post("/producto", agregarProductoVenta);

ventaRouter.get("/:id", traerVentaPorId);

ventaRouter.put("/:id", modificarVentaPorId);

ventaRouter.delete("/:id", eliminarVentaPorId);

module.exports = ventaRouter;