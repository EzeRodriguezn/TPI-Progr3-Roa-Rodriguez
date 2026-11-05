const usuariosController = {
    login: async (req, res) => {
        try {
            res.json({ mensaje: "Inicio de sesión correcto" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = usuariosController;