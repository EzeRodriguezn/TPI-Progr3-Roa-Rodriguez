//node src/utils/encriptar.js

const CLAVE_SECRETA = "12345678901234567890123456789012";

const crypto = require("crypto");
const contraseñaDelUsuario = "abc12334AD";

function encriptar(contraseña) {
    console.time();
    const iv = crypto.randomBytes(12);

    const encriptador = crypto.createCipheriv("aes-256-gcm", CLAVE_SECRETA, iv);

    const resultado = encriptador.update(contraseña, "utf-8", "base64");
    console.log(iv.toString("base64"), resultado);

    console.timeEnd();
    
// PassOriginal + IV + PassServidor + Algoritmo ==> ENCRIPTADO

}
encriptar(contraseñaDelUsuario);