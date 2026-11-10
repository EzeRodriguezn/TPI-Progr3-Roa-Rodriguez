const express = require("express");
const router = express.Router();
const subidaArchivos = require("../middleware/subidaArchivos");
const { protegerRuta } = require("../middleware/autenticacion");
const {
  traerProductos,
  mostrarFormularioNuevo,
  mostrarFormularioEdicion,
  crearProducto,
  modificarProductoPorId,
  desactivarProducto,
  reactivarProducto,
} = require("./producto.controller");

// RUTAS GET (Para mostrar las pantallas HTML del administrador)
router.get("/", traerProductos);
router.get("/nuevo", protegerRuta, mostrarFormularioNuevo);
router.get("/editar/:id", protegerRuta, mostrarFormularioEdicion);

// RUTAS POST (Para enviar los datos de los formularios y ejecutar acciones)
router.post("/nuevo", protegerRuta, subidaArchivos.single("imagen"), crearProducto);
router.post("/editar/:id", protegerRuta, subidaArchivos.single("imagen"), modificarProductoPorId);
router.post("/desactivar/:id", protegerRuta, desactivarProducto);
router.post("/reactivar/:id", protegerRuta, reactivarProducto);

module.exports = router;