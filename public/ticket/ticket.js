const datosTicket = getTicket();

if (!getNombreCliente()) {
  window.location.href = "../index.html";
} else if (!datosTicket) {
  window.location.href = "../productos/productos.html";
} else {
  mostrarTicket();
}

function mostrarTicket() {
  const fecha = new Date(datosTicket.fecha).toLocaleString("es-AR");
  const numero = datosTicket.numero ? `Ticket N° ${esc(datosTicket.numero)}` : "Ticket";
  let htmlItems = "";

  for (const item of datosTicket.items) {
    htmlItems += `
      <div class="d-flex justify-content-between gap-3 mb-1">
        <span>${item.cantidad} x ${esc(item.nombre)}</span>
        <span class="text-nowrap">${formatearPrecio(item.cantidad * item.precio)}</span>
      </div>`;
  }

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
    ${htmlItems}
    <hr />
    <div class="d-flex justify-content-between fs-5 fw-bold">
      <span>TOTAL</span><span>${formatearPrecio(datosTicket.total)}</span>
    </div>
    <p class="text-center small texto-suave mt-4 mb-0">¡Gracias por tu compra!</p>`;
}

function descargarPDF() {
  const jsPDF = window.jspdf.jsPDF;
  const ancho = 80;
  const alto = 70 + datosTicket.items.length * 7;
  const documento = new jsPDF({ unit: "mm", format: [ancho, alto] });
  let posicionY = 12;

  // Encabezado del ticket
  documento.setFontSize(14);
  documento.text(datosTicket.empresa, 40, posicionY, { align: "center" });
  documento.setFontSize(9);
  posicionY += 6;

  if (datosTicket.numero) {
    documento.text(`Ticket N° ${datosTicket.numero}`, 40, posicionY, { align: "center" });
  }

  posicionY += 8;
  documento.text(`Cliente: ${datosTicket.cliente}`, 6, posicionY);
  posicionY += 5;
  documento.text(
    `Fecha: ${new Date(datosTicket.fecha).toLocaleString("es-AR")}`,
    6,
    posicionY
  );
  posicionY += 4;
  documento.line(6, posicionY, 74, posicionY);
  posicionY += 6;

  // Una línea por cada producto
  for (const item of datosTicket.items) {
    const nombreProducto = `${item.cantidad} x ${item.nombre}`.slice(0, 30);
    const subtotal = (item.cantidad * item.precio).toFixed(2);

    documento.text(nombreProducto, 6, posicionY);
    documento.text(`$${subtotal}`, 74, posicionY, { align: "right" });
    posicionY += 6;
  }

  // Total y descarga del archivo
  documento.line(6, posicionY, 74, posicionY);
  posicionY += 7;
  documento.setFontSize(12);
  documento.text("TOTAL", 6, posicionY);
  documento.text(`$${Number(datosTicket.total).toFixed(2)}`, 74, posicionY, { align: "right" });

  let numeroArchivo = datosTicket.numero;
  if (numeroArchivo === null || numeroArchivo === undefined) {
    numeroArchivo = Date.now();
  }
  documento.save(`ticket-${numeroArchivo}.pdf`);
}

const botonPDF = document.getElementById("btn-pdf");
if (botonPDF) {
  botonPDF.addEventListener("click", descargarPDF);
}

const botonSalir = document.getElementById("btn-salir");
if (botonSalir) {
  botonSalir.addEventListener("click", reiniciarSistema);
}
