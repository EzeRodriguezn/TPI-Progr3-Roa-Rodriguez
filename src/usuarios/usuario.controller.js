const bcrypt = require("bcryptjs");
const { Usuario } = require("../database/relaciones");

const crearUsuario = async (req, res) => {
  try {
    const { username, password, rol } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const usuarioCreado = await Usuario.create({
      username,
      password: passwordHasheada,
      rol: rol || "admin",
    });

    res.send(usuarioCreado);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).send({ error: "Error al crear usuario" });
  }
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

    res.cookie("adminLogueado", "true", {
      signed: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error en el login:", error);
    res.render("login", { error: "Ocurrió un error en el servidor" });
  }
};

const cerrarSesion = (req, res) => {
  res.clearCookie("adminLogueado");
  res.redirect("/login");
};

const traerUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
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
  if (rol) datosAModificar.rol = rol;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    datosAModificar.password = await bcrypt.hash(password, salt);
  }

  const modificado = await Usuario.update(datosAModificar, { where: { id } });
  res.send(modificado);
};

const eliminarUsuarioPorId = async (req, res) => {
  const eliminado = await Usuario.destroy({ where: { id: req.params.id } });
  res.send(eliminado);
};

module.exports = {
  crearUsuario,
  procesarLogin,
  cerrarSesion,
  traerUsuarios,
  traerUsuarioPorId,
  modificarUsuarioPorId,
  eliminarUsuarioPorId
};