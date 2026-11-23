document.addEventListener('DOMContentLoaded', () => {
  FutPlayAuth.redirigirSiHaySesion();
  const form = document.getElementById('form-registro');
  if (!form) return;

  const aviso = (icon, title, text) => Swal.fire({
    icon, title, text, confirmButtonColor: '#0268fb', background: '#11151d', color: '#fff'
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const pass = document.getElementById('password').value;
    const confirma = document.getElementById('confirmar').value;
    const rolSel = document.getElementById('rol');
    const rolCodigo = rolSel.value;
    const rolTexto = rolSel.options[rolSel.selectedIndex].text;

    if (!nombre || !correo || !telefono || !pass) return aviso('info', 'Faltan datos', 'Completa todos los campos.');
    if (!FutPlayValidar.regexCorreo.test(correo)) return aviso('warning', 'Correo no válido', 'Revisa el formato del correo.');
    if (telefono.length < 10) return aviso('warning', 'Teléfono no válido', 'Debe tener al menos 10 dígitos.');
    if (!rolCodigo) return aviso('info', 'Selecciona un rol', 'Elige cómo vas a usar FutPlay.');

    const faltas = FutPlayValidar.erroresContrasena(pass);
    if (faltas.length) return aviso('warning', 'Contraseña débil', `Te falta: ${faltas.join(', ')}.`);
    if (pass !== confirma) return aviso('error', 'Las contraseñas no coinciden', 'Escríbela de nuevo igual en ambos campos.');

    if (FutPlayAuth.buscarPorCorreo(correo)) {
      return aviso('error', 'Correo ya registrado', 'Ya existe una cuenta con ese correo. Inicia sesión.');
    }

    const sal = FutPlayAuth.nuevaSal();
    const usuario = {
      nombre, correo, telefono, rol: rolTexto, rolCodigo, sal,
      hash: await FutPlayAuth.hashear(pass, sal)
    };

    const lista = FutPlayAuth.obtenerUsuarios();
    lista.push(usuario);
    FutPlayAuth.guardarUsuarios(lista);

    await Swal.fire({
      icon: 'success', title: '¡Cuenta creada!',
      text: `Bienvenido(a), ${nombre}. Accederás a tu panel de ${rolTexto}.`,
      confirmButtonColor: '#0268fb', background: '#11151d', color: '#fff', timer: 2000
    });

    FutPlayAuth.abrirSesion(usuario);
    window.location.href = FutPlayAuth.PANELES[rolCodigo] || 'dashboard.html';
  });
});
  function alternarVerContrasena(idCampo, boton) {
  const campo = document.getElementById(idCampo);
  if (campo.type === 'password') {
    campo.type = 'text';
    boton.textContent = '🙈';
  } else {
    campo.type = 'password';
    boton.textContent = '👁️';
  }
}
