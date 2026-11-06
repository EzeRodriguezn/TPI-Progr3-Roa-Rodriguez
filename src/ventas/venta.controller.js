const { Op } = require("sequelize");
const { Venta, Producto, ProductoVentas } = require("../database/relaciones");

const crearVenta = async (req, res) => {
  const { total, idUsuario } = req.body;

  const ventaCreada = await Venta.create({
    total: total,
    idUsuario: idUsuario, // Este es el ID del cajero que hace la venta
  });

  res.send(ventaCreada);
};

// Esta es tu versión de "crearEstCurso" para la tabla intermedia
const agregarProductoVenta = async (req, res) => {
  const { idVenta, idProducto, cantidad, precio_historico } = req.body;

  const venta = await Venta.findByPk(idVenta);
  const producto = await Producto.findByPk(idProducto);

  if (venta && producto) {
    const relacion = await ProductoVentas.create({
      idVenta: idVenta,
      idProducto: idProducto,
      cantidad: cantidad,
      precio_historico: precio_historico,
    });
    res.send({ ok: true });
  } else {
    res.send({ ok: false });
  }
};

const traerVentas = async (req, res) => {
  // Ordenamos por fecha de creación descendente (las más nuevas primero)
  const ventas = await Venta.findAll({ order: [["createdAt", "DESC"]] });

  res.send(ventas);
};

const traerVentaPorId = async (req, res) => {
  const id = req.params.id;

  const venta = await Venta.findByPk(id);

  res.send(venta);
};

const modificarVentaPorId = async (req, res) => {
  const { total } = req.body;
  const { id } = req.params;

  let datosAModificar = {};

  if (total) {
    datosAModificar.total = total;
  }

  const modificado = await Venta.update(datosAModificar, {
    where: { id },
  });

  res.send(modificado);
};

const eliminarVentaPorId = async (req, res) => {
  const eliminado = await Venta.destroy({ where: { id: req.params.id } });

  res.send(eliminado);
};

module.exports = {
  crearVenta,
  agregarProductoVenta,
  traerVentas,
  traerVentaPorId,
  modificarVentaPorId,
  eliminarVentaPorId,
};