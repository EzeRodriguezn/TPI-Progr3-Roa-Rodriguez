const form = document.getElementById("form-bienvenida");
const inputNombre = document.getElementById("nombre");

inputNombre.value = Cliente.nombre() ?? "";

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  inputNombre.value = inputNombre.value.trim();
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;

  Cliente.guardar(inputNombre.value);
  irA("productos/index.html");
});
