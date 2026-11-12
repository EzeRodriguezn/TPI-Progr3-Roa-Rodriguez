// Utilidades compartidas por todas las páginas (productos, carrito, ticket)

function esc(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[caracter]);
}

function formatearPrecio(valor) {
  const precio = Number(valor);
  return Number.isFinite(precio)
    ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(precio)
    : "Precio no disponible";
}