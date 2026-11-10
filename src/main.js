const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const productoRouter = require("./productos/producto.routes");
const usuarioRouter = require("./usuarios/usuario.routes");
const ventaRouter = require("./ventas/venta.routes");
const sequelize = require("./database/sequelize");
require("./database/relaciones");
const manejadorErrores = require("./middleware/errores");
const { protegerRuta } = require("./middleware/autenticacion");

const app = express();
const cookieSecret = process.env.COOKIE_SECRET;

if (!cookieSecret || cookieSecret.length < 32) {
  throw new Error("COOKIE_SECRET debe tener al menos 32 caracteres en el archivo .env");
}

const origenesConfigurados = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origen) => origen.trim())
  .filter(Boolean);

app.set("trust proxy", process.env.NODE_ENV === "production");
app.use(cookieParser(cookieSecret));
app.use((req, res, next) => {
  res.locals.adminLogueado = req.signedCookies.adminLogueado === "true";
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/imagenes", express.static(path.join(__dirname, "..", "public", "descargas")));
app.use("/public", express.static(path.join(__dirname, "..", "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use(
  cors({
    origin: (origen, callback) => {
      const esOrigenLocal = !origen ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origen);
      if (esOrigenLocal || origenesConfigurados.includes(origen)) {
        return callback(null, true);
      }
      return callback(new Error("Origen CORS no permitido"));
    },
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/productos", productoRouter);
app.use("/usuarios", usuarioRouter);
app.use("/ventas", ventaRouter);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", (req, res) => {
  protegerRuta(req, res, () => res.render("index"));
});

app.use(manejadorErrores);

const PORT = Number(process.env.PORT || 3000);

sequelize.sync()
  .then(() => {
    console.log("Conexion establecida!!");
    app.listen(PORT, () => {
      console.log(`El server inició correctamente en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });