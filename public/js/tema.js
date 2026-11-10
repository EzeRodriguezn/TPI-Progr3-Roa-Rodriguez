document.documentElement.setAttribute("data-bs-theme", localStorage.getItem("tema") || "light");

function alternarTema() {
  const nuevo = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-bs-theme", nuevo);
  localStorage.setItem("tema", nuevo); // se mantiene al recargar
  actualizarIconoTema();
}

function actualizarIconoTema() {
  const icono = document.getElementById("icono-tema");
  if (!icono) return;
  const oscuro = document.documentElement.getAttribute("data-bs-theme") === "dark";
  icono.className = oscuro ? "bi bi-moon-stars" : "bi bi-brightness-high";
}
