const bcrypt = require("bcryptjs");
const { Usuario } = require("../database/relaciones");

const publicUserAttributes = ["id", "nombre", "email", "createdAt", "updatedAt"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const crearUsuario = async (req, res, next) => {
  const body = req.body || {};
  const email = body.email ?? body.username;
  const { nombre, password } = body;

  if (typeof email !== "string" || !emailPattern.test(email)) {
    return res.status(400).json({ error: "Se requiere un email válido" });
  }
  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ error: "La contraseña es obligatoria" });
  }
  if (nombre !== undefined && nombre !== null && typeof nombre !== "string") {
    return res.status(400).json({ error: "El nombre debe ser un texto" });
  }

  try {
    const passwordHasheada = await bcrypt.hash(password, 10);
    const usuarioCreado = await Usuario.create({
      nombre: nombre ?? null,
      email,
      password: passwordHasheada,
    });

    res.status(201).json(await Usuario.findByPk(usuarioCreado.id, {
      attributes: publicUserAttributes,
    }));
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Ya existe un usuario con ese email" });
    }
    return next(error);
  }
};

const traerUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: publicUserAttributes,
      order: [["email", "ASC"]],
    });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

const traerUsuarioPorId = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El id debe ser un entero positivo" });
  }

  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: publicUserAttributes,
    });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

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
  if (body.nombre !== undefined) {
    if (body.nombre !== null && typeof body.nombre !== "string") {
      return res.status(400).json({ error: "El nombre debe ser un texto" });
    }
    datosAModificar.nombre = body.nombre;
  }

  const email = body.email ?? body.username;
  if (email !== undefined) {
    if (typeof email !== "string" || !emailPattern.test(email)) {
      return res.status(400).json({ error: "Se requiere un email válido" });
    }
    datosAModificar.email = email;
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
      return res.status(409).json({ error: "Ya existe un usuario con ese email" });
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
    const email = body.email ?? body.username;
    const { password } = body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || typeof password !== "string" ||
        !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).render("login", { error: "Credenciales incorrectas" });
    }

    res.cookie("adminLogueado", "true", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

const cerrarSesion = (req, res) => {
  res.clearCookie("adminLogueado", {
    signed: true,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
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
};
