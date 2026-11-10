// Estado de la sesión del cliente (nombre, carrito, ticket) + utilidades.
const peso = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

const esc = (t) =>
  String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const leer = (clave, defecto) => {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? defecto;
  } catch {
    return defecto;
  }
};

const irA = (ruta) => (location.href = new URL(ruta, CONFIG.RAIZ).href);

const Cliente = {
  nombre: () => localStorage.getItem("cliente"),
  guardar: (nombre) => localStorage.setItem("cliente", nombre),
};

const Carrito = {
  items: () => leer("carrito", []),
  _guardar(items) {
    localStorage.setItem("carrito", JSON.stringify(items));
    document.dispatchEvent(new Event("carrito:cambio"));
  },
  cantidadDe: (id) => Carrito.items().find((i) => i.id === id)?.cantidad ?? 0,
  // p = { id, nombre, precio, imagen, stock }. Devuelve false si no hay más stock.
  agregar(p) {
    const items = Carrito.items();
    const item = items.find((i) => i.id === p.id);
    if (item) {
      if (item.cantidad >= p.stock) return false;
      item.cantidad++;
    } else {
      if (p.stock < 1) return false;
      items.push({ id: p.id, nombre: p.nombre, precio: Number(p.precio), imagen: p.imagen, stock: p.stock, cantidad: 1 });
    }
    Carrito._guardar(items);
    return true;
  },
  quitar(id) {
    const items = Carrito.items();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    item.cantidad--;
    Carrito._guardar(items.filter((i) => i.cantidad > 0));
  },
  eliminar: (id) => Carrito._guardar(Carrito.items().filter((i) => i.id !== id)),
  vaciar() {
    localStorage.removeItem("carrito");
    document.dispatchEvent(new Event("carrito:cambio"));
  },
  total: () => Carrito.items().reduce((t, i) => t + i.precio * i.cantidad, 0),
  cantidadTotal: () => Carrito.items().reduce((t, i) => t + i.cantidad, 0),
};

const Ticket = {
  obtener: () => leer("ticket", null),
  guardar: (t) => localStorage.setItem("ticket", JSON.stringify(t)),
};

// Autoservicio: al terminar, el sistema vuelve a empezar de cero.
function reiniciarSistema() {
  ["cliente", "carrito", "ticket"].forEach((k) => localStorage.removeItem(k));
  irA("index.html");
}

// Sin nombre no se puede ver nada más que la bienvenida.
function exigirCliente() {
  if (Cliente.nombre()) return true;
  location.replace(new URL("index.html", CONFIG.RAIZ).href);
  return false;
}
