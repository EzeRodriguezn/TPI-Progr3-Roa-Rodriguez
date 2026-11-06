const { Op } = require("sequelize");
const { Producto } = require("../database/relaciones");

const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, categoria, subcategoria } = req.body;

    const productoCreado = await Producto.create({
      nombre,
      precio,
      stock,
      categoria,
      subcategoria,
    });

    res.status(201).json(productoCreado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};
const traerProductos = async (req, res) => {
  // Ordenamos alfabéticamente por nombre del producto
  const productos = await Producto.findAll({ order: [["nombre", "ASC"]] });

  res.send(productos);
};

const traerProductoPorId = async (req, res) => {
  const id = req.params.id;

  const producto = await Producto.findByPk(id);

  res.send(producto);
};

const modificarProductoPorId = async (req, res) => {
  const { nombre, precio, stock } = req.body;
  const { id } = req.params;

  let datosAModificar = {};

  if (nombre) {
    datosAModificar.nombre = nombre;
  }
  if (precio) {
    datosAModificar.precio = precio;
  }
  // Usamos !== undefined por si queremos mandar un stock de 0
  if (stock !== undefined) {
    datosAModificar.stock = stock;
  }
  
  if (categoria) {
    datosAModificar.categoria = categoria;
  }
  if (subcategoria) {
    datosAModificar.subcategoria = subcategoria;
  }

  const modificado = await Producto.update(datosAModificar, {
    where: { id },
  });

  res.send(modificado);
};

const eliminarProductoPorId = async (req, res) => {
  const eliminado = await Producto.destroy({ where: { id: req.params.id } });

  res.send(eliminado);
};

module.exports = {
  crearProducto,
  traerProductos,
  traerProductoPorId,
  modificarProductoPorId,
  eliminarProductoPorId,
};