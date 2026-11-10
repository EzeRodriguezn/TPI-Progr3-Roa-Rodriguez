const protegerRuta = (req, res, next) => {
  // Leemos las cookies directamente desde los headers de la petición
  const cookies = req.headers.cookie;

  // Si la cookie existe y tiene nuestro valor "true", lo dejamos pasar
  if (cookies && cookies.includes("adminLogueado=true")) {
    return next(); 
  }
  
  // Si no tiene la cookie, lo pateamos al login
  res.redirect("/login");
};

module.exports = { protegerRuta };