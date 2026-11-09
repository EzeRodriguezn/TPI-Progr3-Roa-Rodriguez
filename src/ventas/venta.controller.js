const { Venta, ProductoVentas } = require("../database/relaciones");

// API para recibir el carrito del frontend (Simplificada)
const registrarVentaAPI = async (req, res) => {
  try {
    const { total, idUsuario = 1, carrito = [] } = req.body;
    
    const nuevaVenta = await Venta.create({ total, idUsuario });
    
    for (let item of carrito) {
      await ProductoVentas.create({
        idVenta: nuevaVenta.id,
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precio_historico: item.precio,
      });
    }
    res.json({ mensaje: "Venta registrada con éxito", idVenta: nuevaVenta.id });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar la venta" });
  }
};

// CRUD original comprimido
const traerVentas = async (req, res) => res.send(await Venta.findAll({ order: [["createdAt", "DESC"]] }));
const traerVentaPorId = async (req, res) => res.send(await Venta.findByPk(req.params.id));
const eliminarVentaPorId = async (req, res) => res.send(await Venta.destroy({ where: { id: req.params.id } }));
const crearVenta = async (req, res) => res.send(await Venta.create(req.body));
const agregarProductoVenta = async (req, res) => res.send(await ProductoVentas.create(req.body));
const modificarVentaPorId = async (req, res) => res.send(await Venta.update(req.body, { where: { id: req.params.id } }));

module.exports = {
  registrarVentaAPI, 
  traerVentas, 
  traerVentaPorId, 
  eliminarVentaPorId, 
  crearVenta, 
  agregarProductoVenta, 
  modificarVentaPorId
};