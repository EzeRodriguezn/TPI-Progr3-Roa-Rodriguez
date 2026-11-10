function montarLayout() {
  const pagina = document.body.dataset.pagina;
  const ruta = (r) => new URL(r, CONFIG.RAIZ).href;
  const item = (id, href, texto, icono, extra = "") =>
    `<li class="nav-item"><a class="nav-link ${pagina === id ? "active fw-semibold" : ""}" href="${href}">
       <i class="bi ${icono}"></i> ${texto} ${extra}</a></li>`;

  const nombre = Cliente.nombre();

  document.getElementById("encabezado").innerHTML = `
    <nav class="navbar navbar-expand-md bg-body-tertiary border-bottom sticky-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${ruta("index.html")}">
          <img src="${ruta("img/logo.svg")}" alt="Logo ${esc(CONFIG.EMPRESA)}" />
          <span class="fw-bold">${esc(CONFIG.EMPRESA)}</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Menú">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="menu">
          <ul class="navbar-nav me-auto">
            ${item("bienvenida", ruta("index.html"), "Inicio", "bi-house")}
            ${item("productos", ruta("productos/index.html"), "Productos", "bi-grid")}
            ${item("carrito", ruta("carrito/index.html"), "Carrito", "bi-cart3",
              `<span class="badge rounded-pill text-bg-primary" id="badge-carrito">0</span>`)}
          </ul>
          <div class="d-flex align-items-center gap-2">
            ${nombre ? `<span class="text-body-secondary small">Hola, ${esc(nombre)}</span>` : ""}
            <button class="btn btn-outline-secondary btn-sm" id="btn-tema" aria-label="Cambiar tema">
              <i id="icono-tema"></i>
            </button>
            <a class="btn btn-outline-primary btn-sm" href="${CONFIG.API_URL}/login">
              <i class="bi bi-person-lock"></i> Admin
            </a>
          </div>
        </div>
      </div>
    </nav>`;

  document.getElementById("pie").innerHTML = `
    <div class="container py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-1 small text-body-secondary">
      <span class="d-flex align-items-center gap-2">
        <img src="${ruta("img/logo.svg")}" alt="" width="20" height="20" />
        <strong>${esc(CONFIG.EMPRESA)}</strong> · Autoservicio
      </span>
      <span>Alumnos: ${CONFIG.ALUMNOS.map(esc).join(" y ")}</span>
    </div>`;

  document.getElementById("btn-tema").addEventListener("click", alternarTema);
  actualizarIconoTema();
  actualizarBadge();
  document.addEventListener("carrito:cambio", actualizarBadge);
}

function actualizarBadge() {
  const badge = document.getElementById("badge-carrito");
  if (badge) badge.textContent = Carrito.cantidadTotal();
}

document.addEventListener("DOMContentLoaded", montarLayout);
