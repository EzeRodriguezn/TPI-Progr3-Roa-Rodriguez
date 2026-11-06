// 1. Importar el framework
const express = require("express");
const productoRouter = require("./productos/producto.routes");
const usuarioRouter = require("./usuarios/usuario.routes");
const ventaRouter = require("./ventas/venta.routes");

const cors = require("cors");

const sequelize = require("./database/sequelize");
const { Usuario, Producto, Venta } = require("./database/relaciones");

// 2. Crear la instancia
const app = express();

// 3. Configuraciones extra
app.use(express.json());
app.use("/imagenes", express.static("img"));
app.use("/public", express.static("public"));

// Configuración de EJS para tus vistas (agregado para el TPI)
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    allowedHeaders: "content-type",
  })
);

// 4. Definir las rutas
app.use("/productos", productoRouter);
app.use("/usuarios", usuarioRouter);
app.use("/ventas", ventaRouter);

// --- AGREGADO: Middleware de manejo de errores global (Punto 8) ---
// Tiene que ir acá, después de las rutas y antes de levantar el servidor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Ocurrió un error en el servidor" });
});

// 5. Conectar la instancia al puerto elegido y a la BD
const PORT = 3000;

sequelize.authenticate()
  .then(() => {
    console.log("Conexion establecida!!");
    app.listen(PORT, () => {
      console.log(`El server inició correctamente en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });