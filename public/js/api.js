async function obtenerProductosAPI() {
  const res = await fetch(`${CONFIG.API_BASE_URL}/productos`);
  if (!res.ok) throw new Error('Error al conectar con el backend');
  return await res.json();
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