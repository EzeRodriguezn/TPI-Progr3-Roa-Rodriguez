const ExcelJS = require("exceljs");
const sequelize = require("../database/sequelize");
const { Usuario, Venta, Producto, ProductoVentas } = require("../database/relaciones");

// Se calcula en centavos para evitar errores de redondeo con decimales.
const convertirPrecioACentavos = (precio, idProducto) => {
  const texto = String(precio);
  if (!/^\d+(?:\.\d{1,2})?$/.test(texto)) {
    throw new Error(`Precio inválido para el producto ${idProducto}`);
  }

  const [pesos, centavos = ""] = texto.split(".");
  return Number(pesos) * 100 + Number(centavos.padEnd(2, "0"));
};

const registrarVentaAPI = async (req, res) => {
  try {
    const body = req.body || {};
    const idUsuario = Number(body.idUsuario ?? 1);
    const carrito = body.carrito;

    // Primero validamos los datos recibidos.
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

      // Validamos todos los precios y stocks antes de modificar la base de datos.
      let totalCentavos = 0;
      const detalles = [];
      for (const producto of productos) {
        const precioCentavos = convertirPrecioACentavos(producto.precio, producto.id);
        const cantidad = cantidades.get(producto.id);

        if (producto.stock < cantidad) {
          return {
            status: 400,
            error: `Stock insuficiente para el producto: ${producto.nombre}. Stock actual: ${producto.stock}, Solicitado: ${cantidad}`,
          };
        }

        totalCentavos += precioCentavos * cantidad;
        if (!Number.isSafeInteger(totalCentavos) || totalCentavos > 9_999_999_999) {
          return { status: 400, error: "El total de la venta excede el máximo permitido" };
        }

        detalles.push({ producto, cantidad, precio: (precioCentavos / 100).toFixed(2) });
      }

      // Si todas las validaciones pasaron, descontamos el stock.
      for (const detalle of detalles) {
        const nuevoStock = detalle.producto.stock - detalle.cantidad;
        await detalle.producto.update({ stock: nuevoStock }, { transaction });
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
      mensaje: "Venta registrada con éxito y stock actualizado",
      idVenta: resultado.idVenta,
    });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    res.status(500).json({ error: "Error al registrar la venta" });
  }
};

const idPositivo = (valor) => {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const montoValido = (valor) =>
  (typeof valor === "number" || typeof valor === "string") &&
  /^\d+(?:\.\d{1,2})?$/.test(String(valor)) &&
  Number.isFinite(Number(valor));

const objetoValido = (valor) => valor && typeof valor === "object" && !Array.isArray(valor);

const traerVentas = async (req, res, next) => {
  try {
    res.json(await Venta.findAll({ order: [["createdAt", "DESC"]] }));
  } catch (error) {
    next(error);
  }
};

const traerVentaPorId = async (req, res, next) => {
  const id = idPositivo(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "El id debe ser un entero positivo" });
  }

  try {
    const venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

const eliminarVentaPorId = async (req, res, next) => {
  const id = idPositivo(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "El id debe ser un entero positivo" });
  }

  try {
    const eliminadas = await Venta.destroy({ where: { id } });
    if (eliminadas === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.json({ eliminadas });
  } catch (error) {
    next(error);
  }
};

const crearVenta = async (req, res, next) => {
  const body = req.body;
  if (!objetoValido(body) || !montoValido(body.total) || !idPositivo(body.idUsuario)) {
    return res.status(400).json({ error: "total e idUsuario válidos son obligatorios" });
  }

  try {
    const venta = await Venta.create({
      total: body.total,
      idUsuario: idPositivo(body.idUsuario),
    });
    res.status(201).json(venta);
  } catch (error) {
    next(error);
  }
};

const agregarProductoVenta = async (req, res, next) => {
  const body = req.body;
  if (!objetoValido(body) ||
      !idPositivo(body.VentaId) ||
      !idPositivo(body.ProductoId) ||
      !idPositivo(body.cantidad) ||
      !montoValido(body.precio_historico)) {
    return res.status(400).json({
      error: "VentaId, ProductoId, cantidad y precio_historico deben ser válidos",
    });
  }

  try {
    const detalle = await ProductoVentas.create({
      VentaId: idPositivo(body.VentaId),
      ProductoId: idPositivo(body.ProductoId),
      cantidad: idPositivo(body.cantidad),
      precio_historico: body.precio_historico,
    });
    res.status(201).json(detalle);
  } catch (error) {
    next(error);
  }
};

const modificarVentaPorId = async (req, res, next) => {
  const id = idPositivo(req.params.id);
  const body = req.body;
  if (!id) {
    return res.status(400).json({ error: "El id debe ser un entero positivo" });
  }
  if (!objetoValido(body)) {
    return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un objeto" });
  }

  const camposPermitidos = ["total", "idUsuario"];
  if (Object.keys(body).some((campo) => !camposPermitidos.includes(campo))) {
    return res.status(400).json({ error: "La solicitud contiene campos no permitidos" });
  }

  const datosAModificar = {};
  if (body.total !== undefined) {
    if (!montoValido(body.total)) {
      return res.status(400).json({ error: "total debe ser un monto válido" });
    }
    datosAModificar.total = body.total;
  }
  if (body.idUsuario !== undefined) {
    const idUsuario = idPositivo(body.idUsuario);
    if (!idUsuario) {
      return res.status(400).json({ error: "idUsuario debe ser un entero positivo" });
    }
    datosAModificar.idUsuario = idUsuario;
  }
  if (Object.keys(datosAModificar).length === 0) {
    return res.status(400).json({ error: "No se enviaron campos para modificar" });
  }

  try {
    const [actualizadas] = await Venta.update(datosAModificar, { where: { id } });
    if (actualizadas === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.json({ actualizadas });
  } catch (error) {
    next(error);
  }
};

const exportarExcelVentas = async (req, res, next) => {
  try {
    const ventas = await Venta.findAll({ order: [["createdAt", "DESC"]] });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte de Ventas");

    worksheet.columns = [
      { header: "ID Venta", key: "id", width: 10 },
      { header: "ID Usuario", key: "idUsuario", width: 15 },
      { header: "Total ($)", key: "total", width: 15 },
      { header: "Fecha", key: "fecha", width: 25 }
    ];

    worksheet.getRow(1).font = { bold: true };

    ventas.forEach(venta => {
      worksheet.addRow({
        id: venta.id,
        idUsuario: venta.idUsuario,
        total: venta.total,
        fecha: venta.createdAt ? venta.createdAt.toLocaleString() : ""
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=Reporte_Ventas.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al exportar Excel:", error);
    res.status(500).send("Error al generar el archivo Excel");
  }
};

module.exports = {
  registrarVentaAPI, 
  traerVentas, 
  traerVentaPorId, 
  eliminarVentaPorId, 
  crearVenta, 
  agregarProductoVenta, 
  modificarVentaPorId,
  exportarExcelVentas
};