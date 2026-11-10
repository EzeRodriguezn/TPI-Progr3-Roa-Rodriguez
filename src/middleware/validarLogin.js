const { z } = require("zod");

const esquemaLogin = z.object({
  email: z.string().min(1, "El email es obligatorio").email("El formato del correo no es válido"),
  password: z.string().min(1, "La contraseña no puede estar vacía"),
});

const validarLogin = (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const datosLogin = {
    ...body,
    email: body.email ?? body.username,
  };
  const resultado = esquemaLogin.safeParse(datosLogin);

  if (!resultado.success) {
    const mensajesDeError = resultado.error.issues.map((issue) => {
      if (issue.path[0] === "email" && issue.code === "invalid_type") {
        return "El email es obligatorio";
      }
      if (issue.path[0] === "password" && issue.code === "invalid_type") {
        return "La contraseña es obligatoria";
      }
      return issue.message;
    }).join(" | ");
    return res.status(400).render("login", { error: mensajesDeError });
  }

  req.body = resultado.data;
  next();
};

module.exports = { validarLogin };