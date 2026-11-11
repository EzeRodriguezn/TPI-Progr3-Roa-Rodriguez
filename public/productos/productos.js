const grilla = document.getElementById("grilla");
const tabs = document.getElementById("tabs");
const paginacion = document.getElementById("paginacion");

let productos = [];
let categoria = "";
let pagina = 1;

async function iniciar() {
  if (!exigirCliente()) return;
  document.getElementById("nombre-cliente").textContent = Cliente.nombre();

  try {
    productos = await Api.productos();
  } catch (error) {
    grilla.innerHTML = `<div class="col-12"><div class="alert alert-danger">${esc(error.message)}</div></div>`;
    return;
  }

  const categorias = [...new Set(productos.map((p) => p.categoria))];
  categoria = categorias[0];
  tabs.innerHTML = categorias
    .map((c) => `<li class="nav-item"><button class="nav-link" data-categoria="${esc(c)}">${esc(c)}</button></li>`)
    .join("");
  render();
}

function render() {
  tabs.querySelectorAll(".nav-link").forEach((b) => b.classList.toggle("active", b.dataset.categoria === categoria));

  const delaCategoria = productos.filter((p) => p.categoria === categoria);
  const paginas = Math.max(1, Math.ceil(delaCategoria.length / CONFIG.PRODUCTOS_POR_PAGINA));
  pagina = Math.min(pagina, paginas);
  const desde = (pagina - 1) * CONFIG.PRODUCTOS_POR_PAGINA;

  grilla.innerHTML = delaCategoria
    .slice(desde, desde + CONFIG.PRODUCTOS_POR_PAGINA)
    .map(tarjeta)
    .join("");

  let botones = `<li class="page-item ${pagina === 1 ? "disabled" : ""}"><button class="page-link" data-pagina="${pagina - 1}">Anterior</button></li>`;
  for (let n = 1; n <= paginas; n++) {
    botones += `<li class="page-item ${n === pagina ? "active" : ""}"><button class="page-link" data-pagina="${n}">${n}</button></li>`;
  }
  botones += `<li class="page-item ${pagina === paginas ? "disabled" : ""}"><button class="page-link" data-pagina="${pagina + 1}">Siguiente</button></li>`;
  paginacion.innerHTML = botones;
}

function tarjeta(p) {
  const cantidad = Carrito.cantidadDe(p.id);
  let controles;
  if (p.stock < 1) {
    controles = `<button class="btn btn-secondary w-100" disabled>Sin stock</button>`;
  } else if (cantidad === 0) {
    controles = `<button class="btn btn-primary w-100" data-accion="mas" data-id="${p.id}"><i class="bi bi-cart-plus"></i> Agregar</button>`;
  } else {
    controles = `
      <div class="d-flex align-items-center justify-content-between">
        <button class="btn btn-outline-primary" data-accion="menos" data-id="${p.id}" aria-label="Quitar uno"><i class="bi bi-dash"></i></button>
        <span class="fw-bold fs-5">${cantidad}</span>
        <button class="btn btn-outline-primary" data-accion="mas" data-id="${p.id}" aria-label="Agregar uno" ${cantidad >= p.stock ? "disabled" : ""}><i class="bi bi-plus"></i></button>
      </div>`;
  }

  return `
    <div class="col">
      <div class="card h-100 shadow-sm producto-card">
        <img src="${Api.urlImagen(p.imagen)}" class="card-img-top producto-img" alt="${esc(p.nombre)}" />
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge text-bg-secondary">${esc(p.subcategoria ?? "")}</span>
            <small class="text-body-secondary">Stock: ${p.stock}</small>
          </div>
          <h5 class="card-title">${esc(p.nombre)}</h5>
          <p class="precio fs-4 mt-auto mb-3">${peso.format(p.precio)}</p>
          ${controles}
        </div>
      </div>
    </div>`;
}

// EVENTOS (delegación: un solo listener por contenedor)
grilla.addEventListener("click", (ev) => {
  const boton = ev.target.closest("[data-accion]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "mas") Carrito.agregar(productos.find((p) => p.id === id));
  else Carrito.quitar(id);
  render();
});

tabs.addEventListener("click", (ev) => {
  const boton = ev.target.closest("[data-categoria]");
  if (!boton) return;
  categoria = boton.dataset.categoria;
  pagina = 1;
  render();
});

paginacion.addEventListener("click", (ev) => {
  const boton = ev.target.closest("[data-pagina]");
  if (!boton) return;
  pagina = Number(boton.dataset.pagina);
  render();
});

iniciar();
