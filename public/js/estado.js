function setNombreCliente(nombre) {
  sessionStorage.setItem('clienteNombre', nombre);
}

function getNombreCliente() {
  return sessionStorage.getItem('clienteNombre') || '';
}

function getCarrito() {
  return JSON.parse(sessionStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
  sessionStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(producto) {
  const carrito = getCarrito();
  const index = carrito.findIndex(item => item.id === producto.id);
  
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito(carrito);
}

function actualizarCantidadCarrito(productoId, cambio) {
  let carrito = getCarrito();
  const index = carrito.findIndex(item => item.id === productoId);
  
  if (index !== -1) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
  }
  guardarCarrito(carrito);
}

function eliminarDelCarrito(productoId) {
  let carrito = getCarrito();
  carrito = carrito.filter(item => item.id !== productoId);
  guardarCarrito(carrito);
}

function vaciarCarrito() {
  guardarCarrito([]);
}

function contarItemsCarrito() {
  return getCarrito().reduce((sum, item) => sum + item.cantidad, 0);
}

function calcularTotalCarrito() {
  const total = getCarrito().reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0);
  return Math.round(total * 100) / 100;
}

function guardarTicket(ticket) {
  sessionStorage.setItem('ticket', JSON.stringify(ticket));
}

function getTicket() {
  return JSON.parse(sessionStorage.getItem('ticket'));
}

function actualizarContadorCarrito() {
  const total = getCarrito().reduce((sum, item) => sum + item.cantidad, 0);
  document.querySelectorAll('[data-cart-counter]').forEach((badge) => {
    badge.innerText = total;
  });
}

function reiniciarSistema() {
  sessionStorage.clear();
  window.location.href = '../index.html';
}