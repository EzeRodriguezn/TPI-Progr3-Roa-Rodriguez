const { z, ZodError } = require("zod");

const esquemaLogin = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña no puede estar vacía")
});

const validarLogin = (req, res, next) => {
  try {
    if (req.body?.email === undefined && typeof req.body?.username === "string") {
      req.body.email = req.body.username;
    }

    esquemaLogin.parse(req.body);
    next();
  } catch (error) {
   
    const mensajesDeError = error.issues.map(err => err.message).join(" | ");
    
    return res.render("login", { error: mensajesDeError });
  }
};

module.exports = { validarLogin };