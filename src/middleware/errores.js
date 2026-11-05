const manejadorErrores = (error, req, res, next) => {
    console.error(error.stack);

    const codigoEstado = error.status || 500;
    const mensaje = error.message || 'Error interno del servidor';

    if (req.originalUrl.startsWith('/api')) {
        return res.status(codigoEstado).json({
            error: true,
            mensaje: mensaje
        });
    }

    res.status(codigoEstado).render('error', {
        mensaje: mensaje,
        estado: codigoEstado
    });
};

module.exports = manejadorErrores;