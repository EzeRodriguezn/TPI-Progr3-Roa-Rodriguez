function inyectarLayout() {
  const header = document.createElement('header');
  const esSubcarpeta = window.location.pathname.includes('/productos/') || 
                       window.location.pathname.includes('/carrito/') || 
                       window.location.pathname.includes('/ticket/');
  const rutaBase = esSubcarpeta ? '../' : './';

  header.innerHTML = `
    <nav class="navbar navbar-expand-lg border-bottom sticky-top bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${rutaBase}index.html">
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
              <a class="nav-link" href="${rutaBase}productos/index.html">Productos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${rutaBase}carrito/index.html">
                Carrito <span id="cart-counter" class="badge bg-primary rounded-pill">0</span>
              </a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2">
            <button id="btn-tema" onclick="alternarTema()" class="btn btn-outline-secondary btn-sm">
              🌙 Modo Oscuro
            </button>
            <a href="${CONFIG.API_BASE_URL}/usuarios/login" class="btn btn-outline-primary btn-sm">
              Acceso Admin
            </a>
          </div>
        </div>
      </div>
    </nav>
  `;
  document.body.prepend(header);
  actualizarContadorCarrito();
}

document.addEventListener('DOMContentLoaded', inyectarLayout);