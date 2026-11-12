function inicializarTema() {
  const temaGuardado = localStorage.getItem('theme') || 'light';
  
  // Mantiene tu lógica original para el HTML
  document.documentElement.setAttribute('data-theme', temaGuardado);
  
  // NUEVO: Le agrega la clase al body para que el CSS funcione fácilmente
  if (temaGuardado === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  actualizarBotonTema(temaGuardado);
}

function alternarTema() {
  const temaActual = document.documentElement.getAttribute('data-theme');
  const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', nuevoTema);
  localStorage.setItem('theme', nuevoTema);
  
  // NUEVO: Alterna la clase en el body
  if (nuevoTema === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  actualizarBotonTema(nuevoTema);
}

function actualizarBotonTema(tema) {
  const btn = document.getElementById('btn-tema');
  
  if (btn) {
    if (tema === 'dark') {
      btn.innerHTML = '☀️';
    } else {
      btn.innerHTML = '🌙';
    }
    
    // Le asigna el evento de clic al botón automáticamente
    btn.onclick = alternarTema;
  }
}
document.addEventListener('DOMContentLoaded', inicializarTema);