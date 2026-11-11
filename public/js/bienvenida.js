document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-bienvenida');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('input-nombre').value.trim();
    if (nombre) {
      setNombreCliente(nombre);
      window.location.href = 'productos/index.html';
    }
  });
});