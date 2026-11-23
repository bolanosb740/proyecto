document.addEventListener('DOMContentLoaded', () => {
  FutPlayAuth.redirigirSiHaySesion();
  const form = document.getElementById('form-login');
  if (!form) return;

  const aviso = (icon, title, text) => Swal.fire({
    icon, title, text, confirmButtonColor: '#0268fb', background: '#11151d', color: '#fff'
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    if (!correo || !contrasena) return aviso('info', 'Faltan datos', 'Escribe tu correo y tu contraseña.');

    const usuario = FutPlayAuth.buscarPorCorreo(correo);
    let valido = false;
    if (usuario && usuario.hash && usuario.sal) {
      valido = (await FutPlayAuth.hashear(contrasena, usuario.sal)) === usuario.hash;
    }

    if (!valido) {
      return aviso('error', 'Datos incorrectos', 'Verifica tu correo y contraseña.');
    }

    FutPlayAuth.abrirSesion(usuario);
    const destino = FutPlayAuth.PANELES[usuario.rolCodigo] || 'dashboard.html';
    window.location.href = destino;
  });
});
