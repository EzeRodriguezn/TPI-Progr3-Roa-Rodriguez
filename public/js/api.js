const Api = {
  async productos() {
    if (CONFIG.USAR_BACKEND) {
      const r = await fetch(`${CONFIG.API_URL}/productos/api`);
      if (!r.ok) throw new Error("No se pudieron traer los productos");
      return (await r.json()).filter((p) => p.activo);
    }
    const r = await fetch(new URL("data/productos.json", CONFIG.RAIZ));
    if (!r.ok) throw new Error("No se pudo leer data/productos.json");
    return (await r.json()).filter((p) => p.activo); // solo activos
  },

  // Devuelve el número de venta/ticket
  async registrarVenta(nombreCliente, items) {
    if (!CONFIG.USAR_BACKEND) return Math.floor(Math.random() * 90000) + 10000;
    const r = await fetch(`${CONFIG.API_URL}/ventas/api`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreCliente,
        carrito: items.map((i) => ({ idProducto: i.id, cantidad: i.cantidad })),
      }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "No se pudo registrar la venta");
    return data.idVenta;
  },

  urlImagen(imagen) {
    if (CONFIG.USAR_BACKEND) return `${CONFIG.API_URL}/public/descargas/${imagen}`;
    return new URL(`img/${imagen}`, CONFIG.RAIZ).href;
  },
};
