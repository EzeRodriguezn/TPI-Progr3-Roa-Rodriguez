const { Op } = require("sequelize");
const { Usuario } = require("../database/relaciones");

const crearUsuario = async (req, res) => {
  // Desestructuramos para mayor seguridad 
  const { username, password, rol } = req.body;

  // Más adelante, archivo utils/hash.js para encriptar la contraseña
  const usuarioCreado = await Usuario.create({
    username: username,
    password: password,
    rol: rol,
  });

  res.send(usuarioCreado);
};

const traerUsuarios = async (req, res) => {
  // Ordenamos alfabéticamente por username, igual que el profe hace con nombre
  const usuarios = await Usuario.findAll({ order: [["username", "ASC"]] });

  res.send(usuarios);
};

const traerUsuarioPorId = async (req, res) => {
  const id = req.params.id;

  const usuario = await Usuario.findByPk(id);

  res.send(usuario);
};

const modificarUsuarioPorId = async (req, res) => {
  const { username, password, rol } = req.body;
  const { id } = req.params;

  let datosAModificar = {};

  // Solo agregamos los campos que realmente vienen en el body
  if (username) {
    datosAModificar.username = username;
  }
  if (password) {
    datosAModificar.password = password;
  }
  if (rol) {
    datosAModificar.rol = rol;
  }

  const modificado = await Usuario.update(datosAModificar, {
    where: { id },
  });

  res.send(modificado);
};

const eliminarUsuarioPorId = async (req, res) => {
  const eliminado = await Usuario.destroy({ where: { id: req.params.id } });

  res.send(eliminado);
};

module.exports = {
  crearUsuario,
  traerUsuarios,
  traerUsuarioPorId,
  modificarUsuarioPorId,
  eliminarUsuarioPorId,
};