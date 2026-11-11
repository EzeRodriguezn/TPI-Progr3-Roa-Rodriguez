document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-bienvenida');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const input = document.getElementById('input-nombre');
      const nombre = input ? input.value.trim() : '';

      if (nombre.length >= 1) {
        // Guardar nombre en sessionStorage
        setNombreCliente(nombre);

        // Redirigir a productos.html
        window.location.href = 'productos/productos.html';
      } else {
        alert('Por favor, ingresá tu nombre para continuar.');
      }
    });
  }
});