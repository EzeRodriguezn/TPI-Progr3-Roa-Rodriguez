const bcrypt = require("bcryptjs");
const contraseña = process.argv[2];

if (!contraseña) {
  throw new Error("Uso: node src/utils/hash.js <contraseña>");
}

console.log(bcrypt.hashSync(contraseña, 16));