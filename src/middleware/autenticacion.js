const protegerRuta = (req, res, next) => {
  if (req.signedCookies && req.signedCookies.adminLogueado === "true") {
    return next();
  }

  if (req.baseUrl === "/usuarios" || req.baseUrl === "/ventas") {
    return res.status(401).json({ error: "Se requiere iniciar sesión" });
  }

  return res.redirect("/login");
};

module.exports = { protegerRuta };