function inicializarTema() {
  const temaGuardado = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', temaGuardado);
  actualizarBotonTema(temaGuardado);
}

function alternarTema() {
  const temaActual = document.documentElement.getAttribute('data-theme');
  const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nuevoTema);
  localStorage.setItem('theme', nuevoTema);
  actualizarBotonTema(nuevoTema);
}

function actualizarBotonTema(tema) {
  const btn = document.getElementById('btn-tema');
  if (btn) {
    btn.innerHTML = tema === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
  }
}

document.addEventListener('DOMContentLoaded', inicializarTema);