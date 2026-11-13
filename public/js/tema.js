function inicializarTema() {
  const temaGuardado = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', temaGuardado);

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
    btn.innerHTML = tema === 'dark' ? '☀️' : ' 🌙';
    btn.onclick = alternarTema;
  }
}

document.addEventListener('DOMContentLoaded', inicializarTema);