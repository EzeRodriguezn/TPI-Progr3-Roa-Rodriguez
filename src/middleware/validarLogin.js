const { z } = require("zod");

const esquemaLogin = z.object({
  email: z.string({ required_error: "El email es obligatorio" }).email("El formato del correo no es válido"),
  password: z.string({ required_error: "La contraseña es obligatoria" }).min(1, "La contraseña no puede estar vacía")
});

const validarLogin = (req, res, next) => {
  try {
  
    esquemaLogin.parse(req.body);
    
    next(); 
  } catch (error) {
   
    const mensajesDeError = error.errors.map(err => err.message).join(" | ");
    
    return res.render("login", { error: mensajesDeError });
  }
};

module.exports = { validarLogin };