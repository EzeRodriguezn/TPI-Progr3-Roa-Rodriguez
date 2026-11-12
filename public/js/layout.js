function inyectarLayout() {
  const header = document.createElement('header');
  
  // Detección de subcarpetas para ajustar la ruta relativa de navegación
  const esSubcarpeta = window.location.pathname.includes('/productos/') || 
                       window.location.pathname.includes('/carrito/') || 
                       window.location.pathname.includes('/ticket/');
  const rutaBase = esSubcarpeta ? '../' : './';

  header.innerHTML = `
    <nav class="navbar navbar-expand-lg border-bottom sticky-top bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${rutaBase}index.html">
          <img src="${rutaBase}img/logo.svg" alt="Logo" width="30" height="30" onerror="this.style.display='none'">
          <span class="fw-bold">TechPoint Autoservicio</span>
        </a>

        <span class="badge bg-secondary d-none d-md-inline-block me-3">
          Alumnos: Roa - Rodríguez
        </span>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navApp">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navApp">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="${rutaBase}productos/productos.html">Productos</a>
            </li>
            <li class="nav-item">
              <!-- AQUÍ ESTÁ EL CAMBIO: Ahora apunta a carrito/carrito.html -->
              <a class="nav-link" href="${rutaBase}carrito/carrito.html">
                Carrito <span id="cart-counter" data-cart-counter class="badge bg-primary rounded-pill">0</span>
              </a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2">
            <button id="btn-tema" onclick="alternarTema()" class="btn btn-outline-secondary btn-sm">
              🌙
            </button>
            <a href="http://localhost:3000/usuarios/login" class="btn btn-outline-primary btn-sm">
              Acceso Admin
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