//validador de Productos
//para no poner los productos en saldo negativo o gratis
const { z } = require("zod");

// Definimos qué datos son válidos para crear o editar un producto
const esquemaProducto = z.object({
  nombre: z.string({ required_error: "El nombre es obligatorio" }).min(2, "El nombre debe tener al menos 2 letras"),
  
  // Usamos z.coerce.number() porque los formularios HTML envían todo como texto (string),
  // y Zod lo convierte automáticamente a número antes de validarlo.
  precio: z.coerce.number({ 
    required_error: "El precio es obligatorio",
    invalid_type_error: "El precio debe ser un número" 
  }).positive("El precio no puede ser negativo o cero"),

  // Opcional: si tenés un campo para la descripción o la categoría (bebida/comida)
  descripcion: z.string().optional(),
});

const validarProducto = (req, res, next) => {
  try {
    esquemaProducto.parse(req.body);
    next(); 
  } catch (error) {
    const mensajesDeError = error.errors.map(err => err.message).join(" | ");
    
    // Como el administrador usa EJS para cargar productos, le devolvemos la vista del formulario con el error.
    // Ajustá "productos/formulario" al nombre real de tu vista EJS.
    return res.render("productos/formulario", { error: mensajesDeError });
  }
};

module.exports = { validarProducto };