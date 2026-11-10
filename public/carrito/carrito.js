const lista = document.getElementById("lista-carrito");
const totalEl = document.getElementById("total");
const totalModal = document.getElementById("total-modal");
const btnFinalizar = document.getElementById("btn-finalizar");
const btnConfirmar = document.getElementById("btn-confirmar");
const errorEl = document.getElementById("error-compra");

function render() {
  const items = Carrito.items();

  if (items.length === 0) {
    lista.innerHTML = `
      <div class="text-center text-body-secondary py-5">
        <i class="bi bi-cart-x display-1"></i>
        <p class="mt-3">Tu carrito está vacío.</p>
      </div>`;
  } else {
    lista.innerHTML = `<ul class="list-group shadow-sm">${items.map(fila).join("")}</ul>`;
  }

  totalEl.textContent = totalModal.textContent = peso.format(Carrito.total());
  btnFinalizar.disabled = items.length === 0;
}

function fila(i) {
  return `
    <li class="list-group-item">
      <div class="d-flex flex-wrap align-items-center gap-3">
        <img src="${Api.urlImagen(i.imagen)}" class="thumb" alt="${esc(i.nombre)}" />
        <div class="flex-grow-1">
          <div class="fw-semibold">${esc(i.nombre)}</div>
          <small class="text-body-secondary">${peso.format(i.precio)} c/u</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-primary btn-sm" data-accion="menos" data-id="${i.id}" aria-label="Quitar uno"><i class="bi bi-dash"></i></button>
          <span class="fw-bold px-1">${i.cantidad}</span>
          <button class="btn btn-outline-primary btn-sm" data-accion="mas" data-id="${i.id}" aria-label="Agregar uno" ${i.cantidad >= i.stock ? "disabled" : ""}><i class="bi bi-plus"></i></button>
        </div>
        <div class="fw-bold text-end" style="min-width: 110px">${peso.format(i.precio * i.cantidad)}</div>
        <button class="btn btn-outline-danger btn-sm" data-accion="eliminar" data-id="${i.id}" aria-label="Eliminar del carrito"><i class="bi bi-trash"></i></button>
      </div>
    </li>`;
}

lista.addEventListener("click", (ev) => {
  const boton = ev.target.closest("[data-accion]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  const item = Carrito.items().find((i) => i.id === id);

  if (boton.dataset.accion === "mas") Carrito.agregar(item);
  else if (boton.dataset.accion === "menos") Carrito.quitar(id);
  else Carrito.eliminar(id);
  render();
});

btnConfirmar.addEventListener("click", async () => {
  errorEl.classList.add("d-none");
  btnConfirmar.disabled = true;
  try {
    const items = Carrito.items();
    const numero = await Api.registrarVenta(Cliente.nombre(), items);

    Ticket.guardar({
      numero,
      empresa: CONFIG.EMPRESA,
      cliente: Cliente.nombre(),
      fecha: new Date().toISOString(),
      items: items.map(({ nombre, cantidad, precio }) => ({ nombre, cantidad, precio })),
      total: Carrito.total(),
    });
    Carrito.vaciar();
    irA("ticket/index.html");
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove("d-none");
    btnConfirmar.disabled = false;
  }
});

if (exigirCliente()) render();
