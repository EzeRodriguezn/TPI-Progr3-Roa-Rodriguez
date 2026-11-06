const express = require("express");
const {
  crearUsuario,
  eliminarUsuarioPorId,
  modificarUsuarioPorId,
  traerUsuarios,
  traerUsuarioPorId,
} = require("./usuario.controller");

const usuarioRouter = express.Router();

usuarioRouter.get("/", traerUsuarios);

usuarioRouter.post("/", crearUsuario);

usuarioRouter.get("/:id", traerUsuarioPorId);

usuarioRouter.put("/:id", modificarUsuarioPorId);

usuarioRouter.delete("/:id", eliminarUsuarioPorId);

module.exports = usuarioRouter;