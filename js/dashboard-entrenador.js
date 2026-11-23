document.addEventListener('DOMContentLoaded', () => {
  const usuario = FutPlayAuth.requerirSesion('entrenador');
  if (!usuario) return;

  document.getElementById('usr-nombre').textContent = usuario.nombre || usuario.correo;
  document.getElementById('btn-logout').addEventListener('click', () => FutPlayAuth.cerrarSesion());

  // Cargar Inventario
  const cargarInventario = () => {
    const inv = FutPlayAuth.obtenerInventario();
    document.getElementById('inv-balones').value = inv.balones || 0;
    document.getElementById('inv-conos').value = inv.conos || 0;
    document.getElementById('inv-platillos').value = inv.platillos || 0;
    document.getElementById('inv-setas').value = inv.setas || 0;
    document.getElementById('inv-escaleras').value = inv.escaleras || 0;
    document.getElementById('inv-vallas').value = inv.vallas || 0;
    document.getElementById('inv-petos').value = inv.petos || 0;
  };

  cargarInventario();

  document.getElementById('form-inventario').addEventListener('submit', (e) => {
    e.preventDefault();
    const inv = {
      balones: parseInt(document.getElementById('inv-balones').value) || 0,
      conos: parseInt(document.getElementById('inv-conos').value) || 0,
      platillos: parseInt(document.getElementById('inv-platillos').value) || 0,
      setas: parseInt(document.getElementById('inv-setas').value) || 0,
      escaleras: parseInt(document.getElementById('inv-escaleras').value) || 0,
      vallas: parseInt(document.getElementById('inv-vallas').value) || 0,
      petos: parseInt(document.getElementById('inv-petos').value) || 0
    };
    FutPlayAuth.guardarInventario(inv);
    Swal.fire({ icon: 'success', title: 'Inventario Actualizado', text: 'Tus implementos deportivos han sido guardados.', confirmButtonColor: '#0268fb' });
  });

  // Cargar Invitaciones
  const renderInvitaciones = () => {
    const lista = FutPlayAuth.obtenerInvitaciones();
    const tbody = document.getElementById('tabla-invitaciones');
    if (!lista.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--gris);">No has enviado invitaciones aún.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(i => `
      <tr>
        <td><strong>${i.nombre}</strong></td>
        <td>${i.correo}</td>
        <td>${i.fecha}</td>
        <td>${i.lugar}</td>
        <td><span class="badge-status badge-pendiente">Pendiente</span></td>
      </tr>
    `).join('');
  };

  renderInvitaciones();

  document.getElementById('form-invitar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nueva = {
      nombre: document.getElementById('inv-nombre').value.trim(),
      correo: document.getElementById('inv-correo').value.trim(),
      fecha: document.getElementById('inv-fecha').value.replace('T', ' '),
      lugar: document.getElementById('inv-lugar').value.trim()
    };
    const lista = FutPlayAuth.obtenerInvitaciones();
    lista.push(nueva);
    FutPlayAuth.guardarInvitaciones(lista);
    renderInvitaciones();
    document.getElementById('form-invitar').reset();
    Swal.fire({ icon: 'success', title: 'Invitación Enviada', text: `Se envió la convocatoria a ${nueva.nombre}.`, confirmButtonColor: '#0268fb' });
  });
});
