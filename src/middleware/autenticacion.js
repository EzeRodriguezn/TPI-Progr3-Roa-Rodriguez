const crypto = require("crypto");

const nombreCookie = "adminLogueado";
const duracionCookie = 60 * 60 * 24; // 24 horas

const obtenerSecreto = () => {
  const secreto = process.env.COOKIE_SECRET;
  if (!secreto || secreto.length < 32) {
    throw new Error("COOKIE_SECRET debe tener al menos 32 caracteres en el archivo .env");
  }
  return secreto;
};

const generarFirma = (valor) =>
  crypto.createHmac("sha256", obtenerSecreto()).update(valor).digest("base64url");

const firmaValida = (valor, firmaRecibida) => {
  if (typeof firmaRecibida !== "string") return false;

  const firmaEsperada = Buffer.from(generarFirma(valor));
  const firma = Buffer.from(firmaRecibida);
  return firma.length === firmaEsperada.length &&
    crypto.timingSafeEqual(firma, firmaEsperada);
};

const leerCookieAdmin = (req) => {
  const cookies = req.headers.cookie || "";
  const cookie = cookies.split(";").map((parte) => parte.trim())
    .find((parte) => parte.startsWith(`${nombreCookie}=`));

  if (!cookie) return false;

  let valorFirmado;
  try {
    valorFirmado = decodeURIComponent(cookie.slice(nombreCookie.length + 1));
  } catch {
    return false;
  }

  const separador = valorFirmado.lastIndexOf(".");
  if (separador === -1) return false;

  const valor = valorFirmado.slice(0, separador);
  const firma = valorFirmado.slice(separador + 1);
  return valor === "true" && firmaValida(valor, firma);
};

const establecerCookieAdmin = (res) => {
  const valor = "true";
  const valorFirmado = `${valor}.${generarFirma(valor)}`;
  const opciones = [
    `${nombreCookie}=${encodeURIComponent(valorFirmado)}`,
    `Max-Age=${duracionCookie}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (process.env.NODE_ENV === "production") opciones.push("Secure");
  res.setHeader("Set-Cookie", opciones.join("; "));
};

const limpiarCookieAdmin = (res) => {
  const opciones = [
    `${nombreCookie}=`,
    "Max-Age=0",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (process.env.NODE_ENV === "production") opciones.push("Secure");
  res.setHeader("Set-Cookie", opciones.join("; "));
};

const cargarAutenticacion = (req, res, next) => {
  try {
    req.adminLogueado = leerCookieAdmin(req);
    res.locals.adminLogueado = req.adminLogueado;
    next();
  } catch (error) {
    next(error);
  }
};

const protegerRuta = (req, res, next) => {
  if (req.adminLogueado) return next();

  if (req.baseUrl === "/usuarios" || req.baseUrl === "/ventas") {
    return res.status(401).json({ error: "Se requiere iniciar sesión" });
  }

  return res.redirect("/login");
};

module.exports = {
  cargarAutenticacion,
  protegerRuta,
  establecerCookieAdmin,
  limpiarCookieAdmin,
};
