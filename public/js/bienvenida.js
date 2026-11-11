document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-bienvenida');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const input = document.getElementById('input-nombre');
      const nombre = input ? input.value.trim() : '';

      if (nombre) {
        setNombreCliente(nombre);
        window.location.href = 'productos/index.html';
      }
    });
  }
});