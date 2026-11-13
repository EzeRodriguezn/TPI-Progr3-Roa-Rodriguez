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

usuarioRouter.get("/login", (req, res) => {
  res.render("login");
});

usuarioRouter.post("/login", validarLogin, procesarLogin);
usuarioRouter.get("/logout", cerrarSesion);

usuarioRouter.post("/", crearUsuario);

usuarioRouter.use(protegerRuta);

usuarioRouter.get("/", traerUsuarios);
usuarioRouter.get("/:id", traerUsuarioPorId);
usuarioRouter.put("/:id", modificarUsuarioPorId);
usuarioRouter.delete("/:id", eliminarUsuarioPorId);

module.exports = usuarioRouter;