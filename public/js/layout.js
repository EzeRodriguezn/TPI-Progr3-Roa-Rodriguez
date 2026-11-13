function inyectarLayout() {
  const paginaActual = document.body.dataset.pagina;

  // Detectar si estamos dentro de una subcarpeta para ajustar las rutas
  const esSubcarpeta =
    window.location.pathname.includes('/productos/') ||
    window.location.pathname.includes('/carrito/') ||
    window.location.pathname.includes('/ticket/');
  const rutaBase = esSubcarpeta ? '../' : './';

  // 1. Header: en TODAS las pantallas
  if (!document.querySelector('.xp-header-wrapper')) {
    const header = document.createElement('header');
    header.className = 'sticky-top xp-header-wrapper';

    const baseApi = (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL) ? CONFIG.API_BASE_URL : 'http://localhost:3000';
    const adminUrl = `${baseApi}/usuarios/login`;
    const temaActual = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    const textoTema = temaActual === 'dark' ? 'Tema ☀️' : 'Tema 🌙';

    header.innerHTML = `
      <nav class="navbar navbar-expand-lg xp-navbar">
        <div class="container-fluid px-3 px-lg-4">
          <a class="navbar-brand d-flex align-items-center gap-2 xp-brand" href="${rutaBase}index.html">
            <img src="${rutaBase}img/logo.png" alt="Logo" width="46" height="40" onerror="this.style.display='none'">
            <span class="fw-bold">RTech Autoservicio</span>
          </a>

          <button class="navbar-toggler xp-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navApp" aria-controls="navApp" aria-expanded="false" aria-label="Abrir menú">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navApp">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-2 ms-lg-3">
              <li class="nav-item">
                <a class="xp-nav-btn ${paginaActual === 'productos' ? 'active' : ''}" href="${rutaBase}productos/productos.html">
                  Productos
                </a>
              </li>
              <li class="nav-item">
                <a class="xp-nav-btn ${paginaActual === 'carrito' ? 'active' : ''}" href="${rutaBase}carrito/carrito.html">
                  Carrito (<span id="cart-counter" data-cart-counter>0</span>)
                </a>
              </li>
            </ul>

            <div class="d-flex align-items-center gap-2 mt-2 mt-lg-0">
              <button type="button" id="btn-tema" class="xp-nav-btn">
                ${textoTema}
              </button>
              <a href="${adminUrl}" class="xp-nav-btn">
                Admin
              </a>
            </div>
          </div>
        </div>
      </nav>
    `;

    document.body.prepend(header);

    if (typeof actualizarBotonTema === 'function') {
      actualizarBotonTema(temaActual);
    }

    if (typeof actualizarContadorCarrito === 'function') {
      actualizarContadorCarrito();
    }
  }

  // 2. Barra de tareas inferior: en TODAS las pantallas
  if (!document.querySelector('.xp-taskbar')) {
    const footer = document.createElement('footer');
    footer.className = 'xp-taskbar';
    footer.innerHTML = `
      <div class="xp-start-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" class="xp-win-logo">
          <path fill="#f25022" d="M2 4.5l8.5-1.2v8.2H2V4.5z"/>
          <path fill="#7fba00" d="M11.5 3.1L22 1.5v10h-10.5V3.1z"/>
          <path fill="#00a4ef" d="M2 12.5h8.5v8.2L2 19.5v-7z"/>
          <path fill="#ffb900" d="M11.5 12.5H22v10l-10.5-1.6v-8.4z"/>
        </svg>
        <span>Inicio</span>
      </div>

      <div class="xp-window-tab">
        <span>RTech - Autoservicio</span>
      </div>

      <div class="xp-tray">
        <span>Alumnos: Roa - Rodríguez</span>
        <span class="xp-tray-sep"> | </span>
        <span>Tecnicatura Universitaria en Programación - UTN Avellaneda</span>
      </div>
    `;

    document.body.append(footer);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inyectarLayout);
} else {
  inyectarLayout();
}