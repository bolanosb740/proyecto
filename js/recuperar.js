document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-recuperar');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const correo = document.getElementById('correo').value.trim();
    if (!correo || !FutPlayValidar.regexCorreo.test(correo)) {
      return Swal.fire({ icon: 'warning', title: 'Atención', text: 'Escribe un correo válido.', confirmButtonColor: '#0268fb', background: '#11151d', color: '#fff' });
    }
    Swal.fire({
      icon: 'success', title: 'Solicitud enviada', text: 'Si el correo existe, recibirás instrucciones para cambiar la clave.', confirmButtonColor: '#0268fb', background: '#11151d', color: '#fff'
    }).then(() => window.location.href = 'login.html');
  });
});
