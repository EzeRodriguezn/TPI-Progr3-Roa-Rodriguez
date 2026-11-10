const express = require("express");
const {
  crearVenta,
  agregarProductoVenta,
  traerVentas,
  traerVentaPorId,
  modificarVentaPorId,
  eliminarVentaPorId,
  registrarVentaAPI // Importamos la función nueva
} = require("./venta.controller");

const ventaRouter = express.Router();

// --- RUTAS API (Para el Frontend) ---
// Tiene que ir ANTES que los /:id
ventaRouter.post("/api", registrarVentaAPI);

// --- RUTAS CRUD DEL ADMINISTRADOR ---
ventaRouter.get("/", traerVentas);
ventaRouter.post("/", crearVenta);
ventaRouter.post("/producto", agregarProductoVenta);
ventaRouter.get("/:id", traerVentaPorId);
ventaRouter.put("/:id", modificarVentaPorId);
ventaRouter.delete("/:id", eliminarVentaPorId);

module.exports = ventaRouter;