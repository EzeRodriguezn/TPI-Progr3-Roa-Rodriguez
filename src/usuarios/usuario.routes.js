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

const usuarioRouter = express.Router();

// --- RUTAS DE AUTENTICACIÓN ---
usuarioRouter.get("/login", (req, res) => {
  res.render("login");
});

usuarioRouter.post("/login", validarLogin, procesarLogin);
usuarioRouter.get("/logout", cerrarSesion);

usuarioRouter.get("/", traerUsuarios);
usuarioRouter.post("/", crearUsuario);

usuarioRouter.get("/:id", traerUsuarioPorId);
usuarioRouter.put("/:id", modificarUsuarioPorId);
usuarioRouter.delete("/:id", eliminarUsuarioPorId);

module.exports = usuarioRouter;