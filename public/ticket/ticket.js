const ticket = Ticket.obtener();
if (!exigirCliente()) {
  /* redirige a la bienvenida */
} else if (!ticket) {
  irA("productos/index.html");
} else {
  render();
}

function render() {
  const fecha = new Date(ticket.fecha).toLocaleString("es-AR");
  document.getElementById("ticket").innerHTML = `
    <div class="text-center mb-3">
      <h2 class="h4 mb-0">${esc(ticket.empresa)}</h2>
      <small class="text-body-secondary">Ticket N° ${ticket.numero}</small>
    </div>
    <div class="small mb-3">
      <div>Cliente: <strong>${esc(ticket.cliente)}</strong></div>
      <div>Fecha: ${fecha}</div>
    </div>
    <hr />
    ${ticket.items
      .map(
        (i) => `<div class="d-flex justify-content-between">
          <span>${i.cantidad} x ${esc(i.nombre)}</span>
          <span>${peso.format(i.cantidad * i.precio)}</span>
        </div>`
      )
      .join("")}
    <hr />
    <div class="d-flex justify-content-between fs-5 fw-bold">
      <span>TOTAL</span><span>${peso.format(ticket.total)}</span>
    </div>
    <p class="text-center small text-body-secondary mt-4 mb-0">¡Gracias por tu compra!</p>`;
}

function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: [80, 70 + ticket.items.length * 7] });
  let y = 12;

  doc.setFontSize(14);
  doc.text(ticket.empresa, 40, y, { align: "center" });
  doc.setFontSize(9);
  y += 6;
  doc.text(`Ticket N° ${ticket.numero}`, 40, y, { align: "center" });
  y += 8;
  doc.text(`Cliente: ${ticket.cliente}`, 6, y);
  y += 5;
  doc.text(`Fecha: ${new Date(ticket.fecha).toLocaleString("es-AR")}`, 6, y);
  y += 4;
  doc.line(6, y, 74, y);
  y += 6;

  ticket.items.forEach((i) => {
    const nombre = `${i.cantidad} x ${i.nombre}`.slice(0, 30);
    doc.text(nombre, 6, y);
    doc.text(`$${(i.cantidad * i.precio).toFixed(2)}`, 74, y, { align: "right" });
    y += 6;
  });

  doc.line(6, y, 74, y);
  y += 7;
  doc.setFontSize(12);
  doc.text("TOTAL", 6, y);
  doc.text(`$${Number(ticket.total).toFixed(2)}`, 74, y, { align: "right" });

  doc.save(`ticket-${ticket.numero}.pdf`);
}

document.getElementById("btn-pdf").addEventListener("click", descargarPDF);
document.getElementById("btn-salir").addEventListener("click", reiniciarSistema);
