const manejadorErrores = (error, peticion, respuesta, siguiente) => {
    console.error(error.stack);

    const codigoEstado = error.status || 500;
    const mensaje = error.message || 'Error interno del servidor';

    if (peticion.originalUrl.startsWith('/api')) {
        return respuesta.status(codigoEstado).json({
            error: true,
            mensaje: mensaje
        });
    }

    respuesta.status(codigoEstado).render('error', {
        mensaje: mensaje,
        estado: codigoEstado
    });
};

module.exports = manejadorErrores;