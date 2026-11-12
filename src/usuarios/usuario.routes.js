const express = require("express");
const {
  crearUsuario,
  eliminarUsuarioPorId,
  modificarUsuarioPorId,
  traerUsuarios,
  traerUsuarioPorId,
  procesarLogin,
  cerrarSesion 
} = require("./usuario.controller");

const { validarLogin } = require("../middleware/validarLogin");
const { protegerRuta } = require("../middleware/autenticacion");

const usuarioRouter = express.Router();

<<<<<<< HEAD
// --- RUTAS PÚBLICAS ---
=======
// --- RUTAS PÚBLICAS (No requieren estar logueado) ---
>>>>>>> develop
usuarioRouter.get("/login", (req, res) => {
  res.render("login");
});

usuarioRouter.post("/login", validarLogin, procesarLogin);
usuarioRouter.get("/logout", cerrarSesion);

<<<<<<< HEAD
// Movimos el POST de creación arriba para que no requiera token/cookie
=======
// Movimos el POST arriba para que Postman pueda crear el usuario sin trabas
>>>>>>> develop
usuarioRouter.post("/", crearUsuario);

// --- BARRERA DE SEGURIDAD ---
usuarioRouter.use(protegerRuta);

<<<<<<< HEAD
// --- RUTAS PROTEGIDAS ---
=======
// --- RUTAS PROTEGIDAS (Solo admins logueados) ---
>>>>>>> develop
usuarioRouter.get("/", traerUsuarios);
usuarioRouter.get("/:id", traerUsuarioPorId);
usuarioRouter.put("/:id", modificarUsuarioPorId);
usuarioRouter.delete("/:id", eliminarUsuarioPorId);

module.exports = usuarioRouter;