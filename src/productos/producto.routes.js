const express = require("express");
const router = express.Router();
const subidaArchivos = require("../middleware/subidaArchivos");
const {
  traerProductos,
  mostrarFormularioNuevo,
  mostrarFormularioEdicion,
  crearProducto,
  modificarProductoPorId,
  desactivarProducto,
  reactivarProducto,
  traerProductosAPI,
} = require("./producto.controller");

// RUTAS GET (Para mostrar las pantallas HTML del administrador)
router.get("/api", traerProductosAPI);
router.get("/", traerProductos);
router.get("/nuevo", mostrarFormularioNuevo);
router.get("/editar/:id", mostrarFormularioEdicion);

// RUTAS POST (Para enviar los datos de los formularios y ejecutar acciones)
router.post("/nuevo", subidaArchivos.single("imagen"), crearProducto);
router.post("/editar/:id", subidaArchivos.single("imagen"), modificarProductoPorId);
router.post("/desactivar/:id", desactivarProducto);
router.post("/reactivar/:id", reactivarProducto);

module.exports = router;