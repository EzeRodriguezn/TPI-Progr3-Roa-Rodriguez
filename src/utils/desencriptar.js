
require("dotenv").config();
const crypto = require("crypto");
const claveHex = process.env.CIFRADO_KEY;
const [ivBase64, cifradoBase64, etiquetaBase64] = process.argv.slice(2);

if (!/^[\da-f]{64}$/i.test(claveHex || "")) {
  throw new Error("CIFRADO_KEY debe contener 64 caracteres hexadecimales");
}

if (!ivBase64 || !cifradoBase64 || !etiquetaBase64) {
  throw new Error("Uso: node src/utils/desencriptar.js <iv> <cifrado> <etiqueta>");
}

const iv = Buffer.from(ivBase64, "base64");
const etiqueta = Buffer.from(etiquetaBase64, "base64");
if (iv.length !== 12 || etiqueta.length !== 16) {
  throw new Error("El IV o la etiqueta de autenticación no tienen un formato válido");
}

const desencriptador = crypto.createDecipheriv(
  "aes-256-gcm",
  Buffer.from(claveHex, "hex"),
  iv,
);
desencriptador.setAuthTag(etiqueta);
const resultado = Buffer.concat([
  desencriptador.update(Buffer.from(cifradoBase64, "base64")),
  desencriptador.final(),
]);

process.stdout.write(`${resultado.toString("utf8")}\n`);