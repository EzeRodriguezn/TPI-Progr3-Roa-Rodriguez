
const app = require('./app');

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
       
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor o conectar la base de datos:', error);
    }
};

iniciarServidor();