const { z } = require("zod");

const esquemaLogin = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña no puede estar vacía")
});

const validarLogin = (req, res, next) => {
  try {
  
    esquemaLogin.parse(req.body);
    
    next(); 
  } catch (error) {
   
    const mensajesDeError = error.issues.map(err => err.message).join(" | ");
    
    return res.render("login", { error: mensajesDeError });
  }
};

module.exports = { validarLogin };