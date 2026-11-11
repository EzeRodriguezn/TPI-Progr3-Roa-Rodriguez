const manejadorErrores = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);

  const estadoSolicitado = Number(error.status || error.statusCode);
  const codigoEstado = estadoSolicitado >= 400 && estadoSolicitado < 600
    ? estadoSolicitado
    : 500;
  const esAPI = req.originalUrl.startsWith("/usuarios") ||
    req.originalUrl.startsWith("/ventas") ||
    (req.get("accept") || "").includes("application/json");
  const mensaje = codigoEstado >= 500
    ? "Ocurrió un error en el servidor"
    : error.message || "Solicitud inválida";

  if (esAPI) {
    return res.status(codigoEstado).json({ error: mensaje });
  }

  return res.status(codigoEstado).send(mensaje);
};

module.exports = manejadorErrores;