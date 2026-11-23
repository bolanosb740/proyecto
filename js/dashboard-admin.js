document.addEventListener('DOMContentLoaded', () => {
  const usuario = FutPlayAuth.requerirSesion('admin');
  if (!usuario) return;

  document.getElementById('usr-nombre').textContent = usuario.nombre || usuario.correo;
  document.getElementById('btn-logout').addEventListener('click', () => FutPlayAuth.cerrarSesion());

  // Render Usuarios
  const renderUsuarios = () => {
    const usuarios = FutPlayAuth.obtenerUsuarios();
    const tbody = document.getElementById('tabla-usuarios-body');
    tbody.innerHTML = usuarios.map((u, idx) => `
      <tr>
        <td><strong>${u.nombre}</strong></td>
        <td>${u.correo}</td>
        <td>${u.telefono || 'N/A'}</td>
        <td><span class="estado-placa estado-aceptado">${u.rol}</span></td>
        <td>
          ${u.rolCodigo !== 'admin' ? `
            <button onclick="eliminarUsuario(${idx})" style="background:#dc2626; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px;">Eliminar</button>
          ` : '<span style="color:var(--gris); font-size:11px;">Admin Protegido</span>'}
        </td>
      </tr>
    `).join('');
  };

  window.eliminarUsuario = (index) => {
    const usuarios = FutPlayAuth.obtenerUsuarios();
    const borrado = usuarios.splice(index, 1);
    FutPlayAuth.guardarUsuarios(usuarios);
    renderUsuarios();
    Swal.fire({ icon: 'success', title: 'Usuario Eliminado', text: `Se eliminó a ${borrado[0].nombre}.`, confirmButtonColor: '#0268fb' });
  };

  // Render Torneos
  const renderTorneosAdmin = () => {
    const torneos = FutPlayAuth.obtenerTorneos();
    const cont = document.getElementById('contenedor-torneos-admin');

    cont.innerHTML = torneos.map((t, idx) => `
      <div style="background:var(--claro); padding:18px; border-radius:8px; margin-bottom:15px; border:1px solid var(--linea);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:20px; color:var(--negro);">${t.nombre}</h4>
          <div>
            <button onclick="toggleEstadoTorneoAdmin(${idx})" class="boton-secundario" style="padding:4px 8px; font-size:11px; color:var(--negro); cursor:pointer;">
              ${t.activo ? 'Desactivar' : 'Activar'}
            </button>
            <button onclick="eliminarTorneoAdmin(${idx})" style="background:#dc2626; color:#fff; border:none; padding:5px 9px; border-radius:4px; cursor:pointer; font-size:11px; margin-left:6px;">
              Eliminar Torneo
            </button>
          </div>
        </div>
        <p style="font-size:13px; color:var(--gris); margin:6px 0;">${t.descripcion}</p>
        <div style="font-size:12px; font-weight:bold; color:var(--azul);">
          Equipos: ${(t.equipos || []).join(', ') || 'Sin equipos'} | Jugadores: ${(t.jugadores || []).join(', ') || 'Sin jugadores'}
        </div>
      </div>
    `).join('');
  };

  window.toggleEstadoTorneoAdmin = (idx) => {
    const torneos = FutPlayAuth.obtenerTorneos();
    torneos[idx].activo = !torneos[idx].activo;
    FutPlayAuth.guardarTorneos(torneos);
    renderTorneosAdmin();
  };

  window.eliminarTorneoAdmin = (idx) => {
    const torneos = FutPlayAuth.obtenerTorneos();
    torneos.splice(idx, 1);
    FutPlayAuth.guardarTorneos(torneos);
    renderTorneosAdmin();
    Swal.fire({ icon: 'success', title: 'Torneo Eliminado', text: 'El torneo fue removido del sistema.', confirmButtonColor: '#0268fb' });
  };

  document.getElementById('form-crear-torneo-admin').addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevo = {
      id: 't_' + Date.now(),
      nombre: document.getElementById('adm-t-nombre').value.trim(),
      imagen: document.getElementById('adm-t-imagen').value.trim(),
      valorPersona: parseInt(document.getElementById('adm-t-persona').value) || 0,
      valorEquipo: parseInt(document.getElementById('adm-t-equipo').value) || 0,
      descripcion: document.getElementById('adm-t-desc').value.trim(),
      activo: true, equipos: [], jugadores: []
    };

    const torneos = FutPlayAuth.obtenerTorneos();
    torneos.push(nuevo);
    FutPlayAuth.guardarTorneos(torneos);
    renderTorneosAdmin();
    document.getElementById('form-crear-torneo-admin').reset();
    Swal.fire({ icon: 'success', title: 'Torneo Creado', text: 'Se registró el torneo con privilegios de Administrador.', confirmButtonColor: '#0268fb' });
  });

  // Render Posiciones & Tarjetas
  const renderPosicionesAdmin = () => {
    const lista = FutPlayAuth.obtenerPosiciones();
    const tbody = document.getElementById('tabla-posiciones-admin');
    tbody.innerHTML = lista.map((p, idx) => `
      <tr>
        <td><strong>${p.equipo}</strong></td>
        <td>${p.pj}</td>
        <td><strong style="color:var(--azul);">${p.pts}</strong></td>
        <td><button onclick="eliminarPosicionAdmin(${idx})" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold;">[X]</button></td>
      </tr>
    `).join('');
  };

  window.eliminarPosicionAdmin = (idx) => {
    const lista = FutPlayAuth.obtenerPosiciones();
    lista.splice(idx, 1);
    FutPlayAuth.guardarPosiciones(lista);
    renderPosicionesAdmin();
  };

  const renderTarjetasAdmin = () => {
    const lista = FutPlayAuth.obtenerTarjetas();
    const tbody = document.getElementById('tabla-tarjetas-admin');
    tbody.innerHTML = lista.map((t, idx) => `
      <tr>
        <td><strong>${t.jugador}</strong></td>
        <td>${t.equipo}</td>
        <td><span class="sancion-${t.tipo}">${t.tipo.toUpperCase()}</span></td>
        <td><button onclick="eliminarTarjetaAdmin(${idx})" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold;">[X]</button></td>
      </tr>
    `).join('');
  };

  window.eliminarTarjetaAdmin = (idx) => {
    const lista = FutPlayAuth.obtenerTarjetas();
    lista.splice(idx, 1);
    FutPlayAuth.guardarTarjetas(lista);
    renderTarjetasAdmin();
  };

  // Inventario & Invitaciones
  const cargarInventarioAdmin = () => {
    const inv = FutPlayAuth.obtenerInventario();
    document.getElementById('adm-balones').value = inv.balones || 0;
    document.getElementById('adm-conos').value = inv.conos || 0;
    document.getElementById('adm-platillos').value = inv.platillos || 0;
    document.getElementById('adm-setas').value = inv.setas || 0;
    document.getElementById('adm-escaleras').value = inv.escaleras || 0;
    document.getElementById('adm-vallas').value = inv.vallas || 0;
    document.getElementById('adm-petos').value = inv.petos || 0;
  };

  document.getElementById('form-inv-admin').addEventListener('submit', (e) => {
    e.preventDefault();
    const inv = {
      balones: parseInt(document.getElementById('adm-balones').value) || 0,
      conos: parseInt(document.getElementById('adm-conos').value) || 0,
      platillos: parseInt(document.getElementById('adm-platillos').value) || 0,
      setas: parseInt(document.getElementById('adm-setas').value) || 0,
      escaleras: parseInt(document.getElementById('adm-escaleras').value) || 0,
      vallas: parseInt(document.getElementById('adm-vallas').value) || 0,
      petos: parseInt(document.getElementById('adm-petos').value) || 0
    };
    FutPlayAuth.guardarInventario(inv);
    Swal.fire({ icon: 'success', title: 'Inventario Actualizado', text: 'Inventario global modificado por Administrador.', confirmButtonColor: '#0268fb' });
  });

  const renderInvitacionesAdmin = () => {
    const lista = FutPlayAuth.obtenerInvitaciones();
    const tbody = document.getElementById('tabla-invitaciones-admin');
    tbody.innerHTML = lista.map((i, idx) => `
      <tr>
        <td><strong>${i.nombre}</strong></td>
        <td>${i.correo}</td>
        <td>${i.fecha} @ ${i.lugar}</td>
        <td><button onclick="eliminarInvitacionAdmin(${idx})" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold;">[Cancelar]</button></td>
      </tr>
    `).join('');
  };

  window.eliminarInvitacionAdmin = (idx) => {
    const lista = FutPlayAuth.obtenerInvitaciones();
    lista.splice(idx, 1);
    FutPlayAuth.guardarInvitaciones(lista);
    renderInvitacionesAdmin();
  };

  renderUsuarios();
  renderTorneosAdmin();
  renderPosicionesAdmin();
  renderTarjetasAdmin();
  cargarInventarioAdmin();
  renderInvitacionesAdmin();
});
