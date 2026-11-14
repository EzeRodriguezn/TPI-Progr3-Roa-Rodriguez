const { Producto } = require("../database/relaciones");
const categoriasPermitidas = new Set(["Perifericos", "Sillas"]);

const traerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({ order: [["nombre", "ASC"]] });
    res.render("productos/listado", { productos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar los productos");
  }
};

const mostrarFormularioNuevo = (req, res) => {
  res.render("productos/formulario");
};

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

const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, categoria, subcategoria } = req.body;
    if (!categoriasPermitidas.has(categoria)) {
      return res.status(400).send("La categoría debe ser periféricos o sillas");
    }

    const imagen = req.file ? req.file.filename : "default.png";

    await Producto.create({
      nombre,
      precio,
      stock,
      categoria,
      subcategoria,
      imagen,
      activo: true,
    });

    res.redirect("/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el producto");
  }
};

const modificarProductoPorId = async (req, res) => {
  try {
    const { nombre, precio, stock, categoria, subcategoria } = req.body;
    const { id } = req.params;

    if (categoria !== undefined && !categoriasPermitidas.has(categoria)) {
      return res.status(400).send("La categoría debe ser periféricos o sillas");
    }

    // Solo se cambian los campos que llegaron en la solicitud.
    const datosAModificar = {};

    if (nombre !== undefined) datosAModificar.nombre = nombre;
    if (precio !== undefined) datosAModificar.precio = precio;
    if (stock !== undefined) datosAModificar.stock = stock;
    if (categoria !== undefined) datosAModificar.categoria = categoria;
    if (subcategoria !== undefined) datosAModificar.subcategoria = subcategoria;

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

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    await producto.destroy();
    res.redirect("/productos");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el producto (puede estar asociado a ventas)");
  }
};

const traerProductosAPI = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: {
        activo: true 
      }
    });
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
  eliminarProducto, 
  traerProductosAPI,
};