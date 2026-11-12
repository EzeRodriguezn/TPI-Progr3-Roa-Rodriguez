async function obtenerProductosAPI() {
  const res = await fetch(`${CONFIG.API_BASE_URL}/productos/api`);
  const datos = await res.json();

  if (!res.ok) {
    throw new Error(datos.error || 'No se pudieron cargar los productos');
  }

  if (!Array.isArray(datos)) {
    throw new Error('El servidor devolvió una respuesta de productos inválida');
  }

  return datos;
}

function urlImagenProducto(imagen) {
  const nombre = typeof imagen === 'string' && imagen.trim() ? imagen.trim() : 'default.png';
  const carpeta = nombre === 'default.png' ? '/public/img/' : '/imagenes/';
  return `${CONFIG.API_BASE_URL}${carpeta}${encodeURIComponent(nombre)}`;
}

async function registrarVentaAPI(datosVenta) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/ventas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosVenta)
  });
  if (!res.ok) throw new Error('Error al registrar la venta');
  return await res.json();
}