const elVacio = document.getElementById("carrito-vacio");
const elContenido = document.getElementById("carrito-contenido");
const lista = document.getElementById("lista-carrito");
const modalEl = document.getElementById("modal-confirmar");

let procesando = false;

function iniciar() {
  const nombreCliente = getNombreCliente();
  if (!nombreCliente) {
    window.location.href = "../index.html";
    return;
  }
  document.getElementById("nombre-cliente").textContent = nombreCliente;
  render();
}

// ---------- RENDER ----------
function render() {
  const carrito = getCarrito();
  const vacio = carrito.length === 0;

  elVacio.classList.toggle("d-none", !vacio);
  elContenido.classList.toggle("d-none", vacio);
  if (vacio) return;

  lista.innerHTML = carrito.map(filaItem).join("");
  document.getElementById("resumen-cantidad").textContent = contarItemsCarrito();
  document.getElementById("resumen-total").textContent = formatearPrecio(calcularTotalCarrito());
}

function filaItem(item) {
  const stock = Number(item.stock) || 0;
  const subtotal = Number(item.precio) * item.cantidad;

  return `
    <li class="list-group-item">
      <div class="d-flex flex-wrap align-items-center gap-3">
        <img src="${esc(urlImagenProducto(item.imagen))}" class="item-carrito-img" alt="${esc(item.nombre)}" />

        <div class="item-carrito-info">
          <h2 class="h6 mb-1">${esc(item.nombre)}</h2>
          <span class="badge text-bg-secondary">${esc(item.subcategoria ?? item.categoria ?? "")}</span>
          <div class="texto-suave small mt-1">${formatearPrecio(item.precio)} c/u</div>
        </div>

        <div class="d-flex align-items-center gap-3 ms-auto">
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-outline-primary btn-sm" data-accion="menos" data-id="${item.id}" aria-label="Quitar uno">
              <i class="bi bi-dash"></i>
            </button>
            <span class="fw-bold px-1">${item.cantidad}</span>
            <button type="button" class="btn btn-outline-primary btn-sm" data-accion="mas" data-id="${item.id}" aria-label="Agregar uno" ${item.cantidad >= stock ? "disabled" : ""}>
              <i class="bi bi-plus"></i>
            </button>
          </div>

          <strong class="text-end" style="min-width: 6.5rem;">${formatearPrecio(subtotal)}</strong>

          <button type="button" class="btn btn-outline-danger btn-sm" data-accion="eliminar" data-id="${item.id}" aria-label="Eliminar ${esc(item.nombre)} del carrito">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </li>`;
}
lista.addEventListener("click", (ev) => {
  const boton = ev.target.closest("[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const item = getCarrito().find((i) => i.id === id);
  if (!item) return;

  switch (boton.dataset.accion) {
    case "mas":
      if (item.cantidad < (Number(item.stock) || 0)) actualizarCantidadCarrito(id, 1);
      break;
    case "menos":
      actualizarCantidadCarrito(id, -1); 
      break;
    case "eliminar":
      eliminarDelCarrito(id);
      break;
  }
  render();
});

document.getElementById("btn-finalizar").addEventListener("click", () => {
  const cantidad = contarItemsCarrito();
  if (cantidad === 0) return;

  document.getElementById("modal-nombre").textContent = getNombreCliente();
  document.getElementById("modal-cantidad").textContent = cantidad === 1 ? "1 producto" : `${cantidad} productos`;
  document.getElementById("modal-total").textContent = formatearPrecio(calcularTotalCarrito());
  mostrarError("");

  bootstrap.Modal.getOrCreateInstance(modalEl).show();
});

document.getElementById("btn-confirmar").addEventListener("click", confirmarCompra);

async function confirmarCompra() {
  if (procesando) return;
  const carrito = getCarrito();
  if (carrito.length === 0) return;

  procesando = true;
  setCargando(true);
  mostrarError("");

  try {
    const fecha = new Date().toISOString();
    const total = calcularTotalCarrito();
    const nombreCliente = getNombreCliente();

const venta = {
      nombreCliente,
      fecha,
      total,
      carrito: carrito.map((i) => ({
        idProducto: i.id, 
        cantidad: i.cantidad,
        precioUnitario: Number(i.precio),
      })),
    };
    const respuesta = await registrarVentaAPI(venta);

    guardarTicket({
      numero: respuesta?.id ?? respuesta?.venta?.id ?? null,
      empresa: CONFIG.NOMBRE_EMPRESA,
      cliente: nombreCliente,
      fecha,
      items: carrito.map((i) => ({ nombre: i.nombre, cantidad: i.cantidad, precio: Number(i.precio) })),
      total,
    });
    vaciarCarrito();

    window.location.href = "../ticket/ticket.html";
  } catch (error) {
    mostrarError(error.message);
    procesando = false;
    setCargando(false);
  }
}
function setCargando(cargando) {
  document.getElementById("spinner-confirmar").classList.toggle("d-none", !cargando);
  document.getElementById("texto-confirmar").textContent = cargando ? "Procesando..." : "Confirmar compra";
  document.getElementById("btn-confirmar").disabled = cargando;
  document.getElementById("btn-cancelar").disabled = cargando;
  document.getElementById("btn-cerrar-modal").disabled = cargando;
}

function mostrarError(mensaje) {
  const caja = document.getElementById("modal-error");
  caja.textContent = mensaje;
  caja.classList.toggle("d-none", !mensaje);
}

iniciar();