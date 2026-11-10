const sequelize = require("../database/sequelize");
const { Usuario, Venta, Producto } = require("../database/relaciones");

const registrarVentaAPI = async (req, res) => {
  try {
    const body = req.body || {};
    const idUsuario = Number(body.idUsuario ?? 1);
    const carrito = body.carrito;

    if (!Number.isSafeInteger(idUsuario) || idUsuario <= 0) {
      return res.status(400).json({ error: "idUsuario debe ser un entero positivo" });
    }
    if (!Array.isArray(carrito) || carrito.length === 0) {
      return res.status(400).json({ error: "carrito debe contener al menos un producto" });
    }

    const cantidades = new Map();
    for (const item of carrito) {
      const idProducto = Number(item?.idProducto);
      const cantidad = Number(item?.cantidad);
      if (!Number.isSafeInteger(idProducto) || idProducto <= 0 ||
          !Number.isSafeInteger(cantidad) || cantidad <= 0) {
        return res.status(400).json({
          error: "Cada producto debe tener idProducto y cantidad como enteros positivos",
        });
      }

      const cantidadTotal = (cantidades.get(idProducto) || 0) + cantidad;
      if (!Number.isSafeInteger(cantidadTotal)) {
        return res.status(400).json({ error: "La cantidad solicitada no es válida" });
      }
      cantidades.set(idProducto, cantidadTotal);
    }

    const resultado = await sequelize.transaction(async (transaction) => {
      const usuario = await Usuario.findByPk(idUsuario, { transaction });
      if (!usuario) {
        return { status: 404, error: "Usuario no encontrado" };
      }

      const idsProducto = [...cantidades.keys()];
      const productos = await Producto.findAll({
        where: { id: idsProducto, activo: true },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (productos.length !== idsProducto.length) {
        return { status: 400, error: "El carrito contiene productos inexistentes o inactivos" };
      }

      let totalCentavos = 0;
      const detalles = productos.map((producto) => {
        const precio = String(producto.precio);
        if (!/^\d+(?:\.\d{1,2})?$/.test(precio)) {
          throw new Error(`Precio inválido para el producto ${producto.id}`);
        }

        const [entero, decimales = ""] = precio.split(".");
        const precioCentavos = Number(entero) * 100 + Number(decimales.padEnd(2, "0"));
        const cantidad = cantidades.get(producto.id);
        totalCentavos += precioCentavos * cantidad;
        if (!Number.isSafeInteger(totalCentavos) || totalCentavos > 9_999_999_999) {
          return null;
        }

        return { producto, cantidad, precio: (precioCentavos / 100).toFixed(2) };
      });

      if (detalles.includes(null)) {
        return { status: 400, error: "El total de la venta excede el máximo permitido" };
      }

      const nuevaVenta = await Venta.create({
        total: (totalCentavos / 100).toFixed(2),
        idUsuario,
      }, { transaction });

      for (const detalle of detalles) {
        await nuevaVenta.addProducto(detalle.producto, {
          through: {
            cantidad: detalle.cantidad,
            precio_historico: detalle.precio,
          },
          transaction,
        });
      }

      return { idVenta: nuevaVenta.id };
    });

    if (resultado.error) {
      return res.status(resultado.status).json({ error: resultado.error });
    }

    res.status(201).json({
      mensaje: "Venta registrada con éxito",
      idVenta: resultado.idVenta,
    });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
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