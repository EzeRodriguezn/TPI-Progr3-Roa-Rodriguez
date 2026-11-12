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

function actualizarContadorCarrito() {
  const badge = document.getElementById('cart-counter');
  if (badge) {
    const carrito = getCarrito();
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    badge.innerText = total;
  }
}

function reiniciarSistema() {
  sessionStorage.clear();
  window.location.href = '../index.html';
}
