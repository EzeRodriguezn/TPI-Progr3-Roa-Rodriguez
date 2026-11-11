function setNombreCliente(nombre) {
  sessionStorage.setItem('clienteNombre', nombre);
}

function getNombreCliente() {
  return sessionStorage.getItem('clienteNombre') || '';
}

function getCarrito() {
  return JSON.parse(sessionStorage.getItem('carrito')) || [];
}

function actualizarContadorCarrito() {
  const badge = document.getElementById('cart-counter');
  if (badge) {
    const carrito = getCarrito();
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    badge.innerText = total;
  }
}
