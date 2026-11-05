const ventasController = {
    crearVenta: async (req, res) => {
        try {
            res.json({ mensaje: "Venta registrada con éxito" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    exportarExcel: async (req, res) => {
        try {
            res.json({ mensaje: "Listado de ventas exportado" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ventasController;