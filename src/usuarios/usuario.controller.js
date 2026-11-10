const bcrypt = require("bcryptjs");
const { Usuario } = require("../database/relaciones");

const crearUsuario = async (req, res) => {
  const { username, password, rol } = req.body;

  // 1. Encriptamos la clave recibida antes de guardarla
  const salt = await bcrypt.genSalt(10);
  const passwordHasheada = await bcrypt.hash(password, salt);

  const usuarioCreado = await Usuario.create({
    username: username,
    password: passwordHasheada, // Guardamos la contraseña encriptada
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
  if (password) {
    // Si desde Postman intentan modificar la clave, también hay que encriptarla
    const salt = await bcrypt.genSalt(10);
    datosAModificar.password = await bcrypt.hash(password, salt);
  }
  if (rol) datosAModificar.rol = rol;

    const usuarioCreado = await Usuario.create({
      nombre: nombre,
      email: email,
      password: passwordHasheada,
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

    // Compara la contraseña que llega del formulario con la encriptada de la BD
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.render("login", { error: "Credenciales incorrectas" });
    }

    // Usamos cookies nativas de Express en lugar de express-session
    res.cookie("adminLogueado", "true", { maxAge: 1000 * 60 * 60 * 24 });
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
  const { nombre, email, password } = req.body;
  const { id } = req.params;

  let datosAModificar = {};
  if (nombre) datosAModificar.nombre = nombre;
  if (email) datosAModificar.email = email;
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

// ACÁ ESTÁ LA CLAVE: Exportamos TODAS las funciones para que el router no tire error
module.exports = {
  crearUsuario,
  procesarLogin,
  cerrarSesion,
  traerUsuarios,
  traerUsuarioPorId,
  modificarUsuarioPorId,
  eliminarUsuarioPorId
};