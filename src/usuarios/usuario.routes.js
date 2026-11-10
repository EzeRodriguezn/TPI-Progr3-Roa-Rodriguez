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

// --- RUTAS PÚBLICAS ---
usuarioRouter.get("/login", (req, res) => {
  res.render("login");
});

usuarioRouter.post("/login", validarLogin, procesarLogin);
usuarioRouter.get("/logout", cerrarSesion);

// Movimos el POST de creación arriba para que no requiera token/cookie
usuarioRouter.post("/", crearUsuario);

// --- BARRERA DE SEGURIDAD ---
usuarioRouter.use(protegerRuta);

// --- RUTAS PROTEGIDAS ---
usuarioRouter.get("/", traerUsuarios);
usuarioRouter.get("/:id", traerUsuarioPorId);
usuarioRouter.put("/:id", modificarUsuarioPorId);
usuarioRouter.delete("/:id", eliminarUsuarioPorId);

module.exports = usuarioRouter;