document.addEventListener('DOMContentLoaded', () => {
  const usuario = FutPlayAuth.requerirSesion('jugador');
  if (!usuario) return;

  document.getElementById('usr-nombre').textContent = usuario.nombre || usuario.correo;
  document.getElementById('btn-logout').addEventListener('click', () => FutPlayAuth.cerrarSesion());
});
