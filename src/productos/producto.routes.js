const express = require("express");
const router = express.Router();
const subidaArchivos = require("../middleware/subidaArchivos");
<<<<<<< HEAD

// 1. Importamos tu nuevo middleware de validación
const { validarProducto } = require("./producto.middleware");

=======
const { protegerRuta } = require("../middleware/autenticacion");
>>>>>>> develop
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
<<<<<<< HEAD
router.get("/nuevo", mostrarFormularioNuevo);
router.get("/editar/:id", mostrarFormularioEdicion);
router.get("/api", traerProductosAPI);

// RUTAS POST (Para enviar los datos de los formularios y ejecutar acciones)
// ORDEN CORRECTO: 1° Sube la imagen -> 2° Valida los datos -> 3° Ejecuta el controlador
router.post("/nuevo", subidaArchivos.single("imagen"), validarProducto, crearProducto);
router.post("/editar/:id", subidaArchivos.single("imagen"), validarProducto, modificarProductoPorId);

// Estas dos no necesitan validación Zod porque no reciben datos de un formulario, solo un ID por URL
router.post("/desactivar/:id", desactivarProducto);
router.post("/reactivar/:id", reactivarProducto);
=======
router.get("/nuevo", protegerRuta, mostrarFormularioNuevo);
router.get("/editar/:id", protegerRuta, mostrarFormularioEdicion);

// RUTAS POST (Para enviar los datos de los formularios y ejecutar acciones)
router.post("/nuevo", protegerRuta, subidaArchivos.single("imagen"), crearProducto);
router.post("/editar/:id", protegerRuta, subidaArchivos.single("imagen"), modificarProductoPorId);
router.post("/desactivar/:id", protegerRuta, desactivarProducto);
router.post("/reactivar/:id", protegerRuta, reactivarProducto);
>>>>>>> develop

module.exports = router;