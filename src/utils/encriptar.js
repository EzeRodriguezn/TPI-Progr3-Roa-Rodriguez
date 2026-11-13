require("dotenv").config();
const crypto = require("crypto");
const claveHex = process.env.CIFRADO_KEY;
const texto = process.argv[2];

if (!/^[\da-f]{64}$/i.test(claveHex || "")) {
  throw new Error("CIFRADO_KEY debe contener 64 caracteres hexadecimales");
}

if (!texto) {
  throw new Error("Uso: node src/utils/encriptar.js <texto>");
}

const iv = crypto.randomBytes(12);
const encriptador = crypto.createCipheriv("aes-256-gcm", Buffer.from(claveHex, "hex"), iv);
const cifrado = Buffer.concat([
  encriptador.update(texto, "utf8"),
  encriptador.final(),
]);

console.log(JSON.stringify({
  iv: iv.toString("base64"),
  cifrado: cifrado.toString("base64"),
  etiqueta: encriptador.getAuthTag().toString("base64"),
}));