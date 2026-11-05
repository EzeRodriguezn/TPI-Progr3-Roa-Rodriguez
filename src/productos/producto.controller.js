const productosController = {
    listar: async (req, res) => {
        try {
            res.json({ mensaje: "Lista de productos" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            res.json({ mensaje: "Producto creado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizar: async (req, res) => {
        try {
            res.json({ mensaje: "Producto actualizado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminar: async (req, res) => {
        try {
            res.json({ mensaje: "Producto eliminado lógicamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productosController;