const bcrypt = require("bcryptjs");
const { Usuario } = require("../database/relaciones");

<<<<<<< HEAD
// Actualizamos los atributos para que coincidan con tu base de datos real
const publicUserAttributes = ["id", "username", "rol", "createdAt", "updatedAt"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const crearUsuario = async (req, res, next) => {
  const body = req.body || {};
  // Si envían "email" por costumbre, lo tomamos como "username"
  const username = body.username ?? body.email; 
  const { password, rol } = body;

  if (typeof username !== "string" || !emailPattern.test(username)) {
    return res.status(400).json({ error: "Se requiere un username válido (formato correo)" });
  }
  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ error: "La contraseña es obligatoria" });
  }
  if (rol !== undefined && rol !== null && typeof rol !== "string") {
    return res.status(400).json({ error: "El rol debe ser un texto" });
  }

=======
const crearUsuario = async (req, res) => {
>>>>>>> develop
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
<<<<<<< HEAD
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Ya existe un usuario con ese username" });
    }
    return next(error);
=======
    console.error("Error al crear usuario:", error);
    res.status(500).send({ error: "Error al crear usuario" });
>>>>>>> develop
  }
};

const procesarLogin = async (req, res) => {
  try {
<<<<<<< HEAD
    const usuarios = await Usuario.findAll({
      attributes: publicUserAttributes,
      order: [["username", "ASC"]],
    });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};
=======
    const { username, password } = req.body;
>>>>>>> develop

    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) {
      return res.render("login", { error: "Credenciales incorrectas" });
    }

<<<<<<< HEAD
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

const modificarUsuarioPorId = async (req, res, next) => {
  const id = Number(req.params.id);
  const body = req.body || {};

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El id debe ser un entero positivo" });
  }

  const datosAModificar = {};
  
  const username = body.username ?? body.email;
  if (username !== undefined) {
    if (typeof username !== "string" || !emailPattern.test(username)) {
      return res.status(400).json({ error: "Se requiere un username válido (formato correo)" });
    }
    datosAModificar.username = username;
  }

  if (body.rol !== undefined) {
    if (typeof body.rol !== "string") {
      return res.status(400).json({ error: "El rol debe ser un texto" });
    }
    datosAModificar.rol = body.rol;
  }

  if (body.password !== undefined) {
    if (typeof body.password !== "string" || body.password.length === 0) {
      return res.status(400).json({ error: "La contraseña no puede estar vacía" });
    }
    try {
      datosAModificar.password = await bcrypt.hash(body.password, 10);
    } catch (error) {
      return next(error);
    }
  }

  if (Object.keys(datosAModificar).length === 0) {
    return res.status(400).json({ error: "No se enviaron campos para modificar" });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await usuario.update(datosAModificar);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Ya existe un usuario con ese username" });
    }
    return next(error);
  }

  try {
    res.json(await Usuario.findByPk(id, { attributes: publicUserAttributes }));
  } catch (error) {
    next(error);
  }
};

const eliminarUsuarioPorId = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El id debe ser un entero positivo" });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await usuario.destroy();
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({ error: "No se puede eliminar el usuario porque tiene ventas asociadas" });
    }
    return next(error);
  }

  res.status(204).end();
};

const procesarLogin = async (req, res, next) => {
  try {
    const body = req.body || {};
    // Reemplazamos la búsqueda por email por username
    const username = body.username ?? body.email;
    const { password } = body;

    const usuario = await Usuario.findOne({ where: { username } });
    
    if (!usuario || typeof password !== "string" ||
        !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).render("login", { error: "Credenciales incorrectas" });
=======
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.render("login", { error: "Credenciales incorrectas" });
>>>>>>> develop
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
<<<<<<< HEAD
  eliminarUsuarioPorId,
  procesarLogin,
  cerrarSesion,
=======
  eliminarUsuarioPorId
>>>>>>> develop
};