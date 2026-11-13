function inyectarLayout() {
  const header = document.createElement('header');
  
  // Detección de subcarpetas para ajustar la ruta relativa de navegación
  const esSubcarpeta = window.location.pathname.includes('/productos/') || 
                       window.location.pathname.includes('/carrito/') || 
                       window.location.pathname.includes('/ticket/');
  const rutaBase = esSubcarpeta ? '../' : './';

  header.innerHTML = `
    <nav class="navbar navbar-expand-lg sticky-top xp-navbar">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2 xp-brand" href="${rutaBase}index.html">
          <img src="${rutaBase}img/logo.png" alt="Logo" width="60" height="50" onerror="this.style.display='none'">
          <span class="fw-bold">RTech Autoservicio</span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navApp">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navApp">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-2 ms-lg-3">
            <li class="nav-item">
              <a class="xp-nav-btn" href="${rutaBase}productos/productos.html">Productos</a>
            </li>
            <li class="nav-item">
              <a class="xp-nav-btn" href="${rutaBase}carrito/carrito.html">
                Carrito (<span id="cart-counter" data-cart-counter>0</span>)
              </a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            <button id="btn-tema" onclick="alternarTema()" class="xp-nav-btn">
              🌙
            </button>
            <a href="http://localhost:3000/usuarios/login" class="xp-nav-btn">
              Admin
            </a>
          </div>
        </div>
      </div>
    </nav>
  `;

  document.body.prepend(header);

  
  
  // Verificación por si la función no existe en la página actual
  if (typeof actualizarContadorCarrito === 'function') {
    actualizarContadorCarrito();
  }
}

document.addEventListener('DOMContentLoaded', inyectarLayout);