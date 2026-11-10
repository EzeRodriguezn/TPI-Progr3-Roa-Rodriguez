const { z, ZodError } = require("zod");

const esquemaLogin = z.object({
  email: z.string().min(1, "El email es obligatorio").email("El formato del correo no es válido"),
  password: z.string({ required_error: "La contraseña es obligatoria" }).min(1, "La contraseña no puede estar vacía")
});

const validarLogin = (req, res, next) => {
  try {
    if (req.body?.email === undefined && typeof req.body?.username === "string") {
      req.body.email = req.body.username;
    }

    esquemaLogin.parse(req.body);
    next();
  } catch (error) {
    if (!(error instanceof ZodError)) {
      return next(error);
    }

    const mensajesDeError = error.issues.map((issue) => {
      if (issue.path[0] === "email" && issue.code === "invalid_type") {
        return "El correo electrónico es obligatorio";
      }
      if (issue.path[0] === "password" && issue.code === "invalid_type") {
        return "La contraseña es obligatoria";
      }
      return issue.message;
    }).join(" | ");
    return res.status(400).render("login", { error: mensajesDeError });
  }
};

module.exports = { validarLogin };