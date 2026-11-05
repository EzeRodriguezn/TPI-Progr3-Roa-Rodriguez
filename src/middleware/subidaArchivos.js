const multer = require('multer');
const path = require('path');

const almacenamiento = multer.diskStorage({
    destination: (peticion, archivo, callback) => {
        callback(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: (peticion, archivo, callback) => {
        const sufijoUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, sufijoUnico + path.extname(archivo.originalname));
    }
});

const filtroArchivos = (peticion, archivo, callback) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const tipoMIME = tiposPermitidos.test(archivo.mimetype);
    const extensionValida = tiposPermitidos.test(path.extname(archivo.originalname).toLowerCase());

    if (tipoMIME && extensionValida) {
        return callback(null, true);
    }
    callback(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
};

const subidaArchivos = multer({
    storage: almacenamiento,
    fileFilter: filtroArchivos,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = subidaArchivos;