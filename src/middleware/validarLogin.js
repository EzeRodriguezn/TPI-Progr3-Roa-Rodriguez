const { z } = require("zod");

// Cambiamos 'email' por 'username' en el esquema
const esquemaLogin = z.object({
<<<<<<< HEAD
  username: z.string().min(1, "El usuario es obligatorio").email("El formato del usuario no es válido (debe ser un correo)"),
=======
  username: z.string().min(1, "El usuario es obligatorio"),
>>>>>>> develop
  password: z.string().min(1, "La contraseña no puede estar vacía"),
});

const validarLogin = (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  
  // Aseguramos que el dato se llame 'username', venga de donde venga
  const datosLogin = {
    ...body,
    username: body.username ?? body.email,
  };
  
  const resultado = esquemaLogin.safeParse(datosLogin);

  if (!resultado.success) {
<<<<<<< HEAD
    const mensajesDeError = resultado.error.issues.map((issue) => {
      if (issue.path[0] === "username" && issue.code === "invalid_type") {
        return "El usuario es obligatorio";
      }
      if (issue.path[0] === "password" && issue.code === "invalid_type") {
        return "La contraseña es obligatoria";
      }
      return issue.message;
    }).join(" | ");
=======
    const mensajesDeError = resultado.error.issues
      .map((issue) => {
        if (issue.path[0] === "username" && issue.code === "invalid_type") {
          return "El usuario es obligatorio";
        }
        if (issue.path[0] === "password" && issue.code === "invalid_type") {
          return "La contraseña es obligatoria";
        }
        return issue.message;
      })
      .join(" | ");
>>>>>>> develop
    return res.status(400).render("login", { error: mensajesDeError });
  }

  // Ahora req.body solo tendrá { username: "...", password: "..." }
  req.body = resultado.data;
  next();
};

module.exports = { validarLogin };