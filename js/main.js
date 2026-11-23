document.addEventListener('DOMContentLoaded', () => {
  const sesion = FutPlayAuth.obtenerSesion();
  const navAcciones = document.getElementById('nav-acciones');
  if (navAcciones) {
    if (sesion) {
      navAcciones.innerHTML = `
        <a href="${FutPlayAuth.PANELES[sesion.rolCodigo] || 'dashboard.html'}" class="boton-contacto">Mi Panel</a>
        <button onclick="FutPlayAuth.cerrarSesion()" class="boton-secundario" style="cursor:pointer; background:transparent;">Cerrar Sesión</button>
      `;
    } else {
      navAcciones.innerHTML = `
        <a href="login.html" class="boton-secundario">Iniciar Sesión</a>
        <a href="registro.html" class="boton-contacto">Registrarse</a>
      `;
    }
  }
});
