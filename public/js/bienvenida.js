document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-bienvenida');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const input = document.getElementById('input-nombre');
      const nombre = input ? input.value.trim() : '';

      if (nombre.length >= 2) {
        // Guardar el nombre en sessionStorage
        setNombreCliente(nombre);

      
        window.location.href = 'productos/productos.html';
      } else {
        alert('Por favor, ingresá un nombre válido.');
      }
    });
  }
});