const { Op } = require("sequelize");
const { Usuario } = require("../database/relaciones");
const bcrypt = require("bcryptjs"); 

const crearUsuario = async (req, res) => {
  const { username, password, rol } = req.body;

  // IMPORTANTE: Para que el login funcione con bcrypt, la contraseña debe guardarse encriptada.
  // Descomentá estas dos líneas cuando vayas a crear un usuario nuevo:
  // const salt = await bcrypt.genSalt(10);
  // const passwordHasheada = await bcrypt.hash(password, salt);

  const usuarioCreado = await Usuario.create({
    username: username,
    password: password, // Cambialo a 'passwordHasheada' cuando actives lo de arriba
    rol: rol,
  });

  res.send(usuarioCreado);
};

const traerUsuarios = async (req, res) => {
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

  if (username) datosAModificar.username = username;
  if (password) datosAModificar.password = password; 
  if (rol) datosAModificar.rol = rol;

  const modificado = await Usuario.update(datosAModificar, {
    where: { id },
  });

  res.send(modificado);
};

const eliminarUsuarioPorId = async (req, res) => {
  const eliminado = await Usuario.destroy({ where: { id: req.params.id } });
  res.send(eliminado);
};

const procesarLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) {
      return res.render("login", { error: "Credenciales incorrectas" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.render("login", { error: "Credenciales incorrectas" });
    }

    // MANDAMOS UNA COOKIE MANUAL AL NAVEGADOR
    // Nombre: adminLogueado | Valor: true | Expira: en 1 día (en milisegundos)
    res.cookie("adminLogueado", "true", { maxAge: 1000 * 60 * 60 * 24 });

    res.redirect("/dashboard");

  } catch (error) {
    console.error("Error en el login:", error);
    res.render("login", { error: "Ocurrió un error en el servidor" });
  }
};

const cerrarSesion = (req, res) => {
  // Borramos la cookie para desloguear al usuario
  res.clearCookie("adminLogueado");
  res.redirect("/login");
};

module.exports = {
  crearUsuario,
  traerUsuarios,
  traerUsuarioPorId,
  modificarUsuarioPorId,
  eliminarUsuarioPorId,
  procesarLogin,
  cerrarSesion,
}