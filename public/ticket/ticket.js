const datosTicket = getTicket();

if (!getNombreCliente()) {
  window.location.href = "../index.html";
} else if (!datosTicket) {
  window.location.href = "../productos/productos.html";
} else {
  render();
}

function render() {
  const fecha = new Date(datosTicket.fecha).toLocaleString("es-AR");
  const numero = datosTicket.numero ? `Ticket N° ${esc(datosTicket.numero)}` : "Ticket";

  document.getElementById("ticket").innerHTML = `
    <div class="text-center mb-3">
      <h2 class="h4 mb-0">${esc(datosTicket.empresa)}</h2>
      <small class="texto-suave">${numero}</small>
    </div>
    <div class="small mb-3">
      <div>Cliente: <strong>${esc(datosTicket.cliente)}</strong></div>
      <div>Fecha: ${esc(fecha)}</div>
    </div>
    <hr />
    ${datosTicket.items
      .map(
        (i) => `<div class="d-flex justify-content-between gap-3 mb-1">
          <span>${i.cantidad} x ${esc(i.nombre)}</span>
          <span class="text-nowrap">${formatearPrecio(i.cantidad * i.precio)}</span>
        </div>`
      )
      .join("")}
    <hr />
    <div class="d-flex justify-content-between fs-5 fw-bold">
      <span>TOTAL</span><span>${formatearPrecio(datosTicket.total)}</span>
    </div>
    <p class="text-center small texto-suave mt-4 mb-0">¡Gracias por tu compra!</p>`;
}

function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: [80, 70 + datosTicket.items.length * 7] });
  let y = 12;

  doc.setFontSize(14);
  doc.text(datosTicket.empresa, 40, y, { align: "center" });
  doc.setFontSize(9);
  y += 6;
  if (datosTicket.numero) {
    doc.text(`Ticket N° ${datosTicket.numero}`, 40, y, { align: "center" });
  }
  y += 8;
  doc.text(`Cliente: ${datosTicket.cliente}`, 6, y);
  y += 5;
  doc.text(`Fecha: ${new Date(datosTicket.fecha).toLocaleString("es-AR")}`, 6, y);
  y += 4;
  doc.line(6, y, 74, y);
  y += 6;

  datosTicket.items.forEach((i) => {
    doc.text(`${i.cantidad} x ${i.nombre}`.slice(0, 30), 6, y);
    doc.text(`$${(i.cantidad * i.precio).toFixed(2)}`, 74, y, { align: "right" });
    y += 6;
  });

  doc.line(6, y, 74, y);
  y += 7;
  doc.setFontSize(12);
  doc.text("TOTAL", 6, y);
  doc.text(`$${Number(datosTicket.total).toFixed(2)}`, 74, y, { align: "right" });

  doc.save(`ticket-${datosTicket.numero ?? Date.now()}.pdf`);
}

document.getElementById("btn-pdf")?.addEventListener("click", descargarPDF);
document.getElementById("btn-salir")?.addEventListener("click", reiniciarSistema);