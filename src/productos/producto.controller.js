const { Producto } = require("../database/relaciones");

// 1. Mostrar la tabla con todos los productos (Renderiza EJS)
const traerProductos = async (req, res) => {
  try {
    // Ordenamos alfabéticamente por nombre del producto
    const productos = await Producto.findAll({ order: [["nombre", "ASC"]] });
    
    // Conecta con src/view/productos/listado.ejs pasándole los datos
    res.render("productos/listado", { productos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar los productos");
  }
};

// 2. Mostrar el formulario vacío para crear (Renderiza EJS)
const mostrarFormularioNuevo = (req, res) => {
  res.render("productos/formulario");
};

// 3. Mostrar el formulario con los datos cargados para editar (Renderiza EJS)
const mostrarFormularioEdicion = async (req, res) => {
  try {
    const id = req.params.id;
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    
    res.render("productos/formulario", { producto });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el producto");
  }
};

// 4. Procesar la creación del producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, categoria, subcategoria } = req.body;
    
    // Atrapamos la imagen procesada por Multer, o ponemos una por defecto
    const imagen = req.file ? req.file.filename : 'default.png';

    await Producto.create({
      nombre,
      precio,
      stock,
      categoria,
      subcategoria,
      imagen,
      activo: true 
    });

    // Redirigimos al listado después de crear
    res.redirect("/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el producto");
  }
};


const modificarProductoPorId = async (req, res) => {
  try {
    // Agregamos categoria y subcategoria que faltaban desestructurar del req.body
    const { nombre, precio, stock, categoria, subcategoria } = req.body;
    const { id } = req.params;

    let datosAModificar = {};

    if (nombre !== undefined) datosAModificar.nombre = nombre;
    if (precio !== undefined) datosAModificar.precio = precio;
    if (stock !== undefined) datosAModificar.stock = stock;
    if (categoria !== undefined) datosAModificar.categoria = categoria;
    if (subcategoria !== undefined) datosAModificar.subcategoria = subcategoria;

    // Si el usuario subió una imagen nueva, la pisamos
    if (req.file) {
      datosAModificar.imagen = req.file.filename;
    }

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    await producto.update(datosAModificar);

    res.redirect("/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al modificar el producto");
  }
};


const desactivarProducto = async (req, res) => {
  try {
    await Producto.update({ activo: false }, { where: { id: req.params.id } });
    res.redirect("/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al desactivar el producto");
  }
};


const reactivarProducto = async (req, res) => {
  try {
    await Producto.update({ activo: true }, { where: { id: req.params.id } });
    res.redirect("/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al reactivar el producto");
  }
};
// Función exclusiva para el frontend (Autoservicio)
const traerProductosAPI = async (req, res) => {
  try {
    // Buscamos solo los productos que estén activos
    const productos = await Producto.findAll({
      where: {
        activo: true // Ajustá este nombre si en tu base de datos la columna se llama distinto (ej: estado, disponible)
      }
    });

    // En vez de un res.render, devolvemos un JSON
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos para la API:", error);
    res.status(500).json({ error: "Ocurrió un error en el servidor" });
  }
};
module.exports = {
  traerProductos,
  mostrarFormularioNuevo,
  mostrarFormularioEdicion,
  crearProducto,
  modificarProductoPorId,
  desactivarProducto,
  reactivarProducto,
  traerProductosAPI,
};