document.addEventListener('DOMContentLoaded', () => {
  const usuario = FutPlayAuth.requerirSesion('organizador');
  if (!usuario) return;

  document.getElementById('usr-nombre').textContent = usuario.nombre || usuario.correo;
  document.getElementById('btn-logout').addEventListener('click', () => FutPlayAuth.cerrarSesion());

  const descInput = document.getElementById('t-desc');
  const counter = document.getElementById('char-counter');
  descInput.addEventListener('input', () => {
    counter.textContent = `${descInput.value.length} / 500 caracteres`;
    if (descInput.value.length < 100 || descInput.value.length > 500) {
      counter.style.color = 'red';
    } else {
      counter.style.color = 'green';
    }
  });

  const renderTorneos = () => {
    const torneos = FutPlayAuth.obtenerTorneos();
    const cont = document.getElementById('contenedor-torneos');
    const selectTorneo = document.getElementById('a-torneo');

    selectTorneo.innerHTML = torneos.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('');

    cont.innerHTML = torneos.map(t => `
      <div style="background:var(--claro); padding:20px; border-radius:8px; border:1px solid var(--linea);">
        <img src="${t.imagen}" alt="${t.nombre}" style="width:100%; height:140px; object-fit:cover; border-radius:4px; margin-bottom:10px;">
        <h3 style="font-size:22px; color:var(--negro);">${t.nombre}</h3>
        <p style="font-size:13px; color:var(--gris); margin:8px 0;">${t.descripcion}</p>
        <div style="font-size:12px; font-weight:bold; color:var(--azul); margin-bottom:10px;">
          💰 Persona: $${t.valorPersona.toLocaleString()} COP | Equipo: $${t.valorEquipo.toLocaleString()} COP
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="badge-status ${t.activo ? 'badge-activo' : 'badge-inactivo'}">
            ${t.activo ? 'ACTIVO' : 'INACTIVO'}
          </span>
          <button onclick="cambiarEstadoTorneo('${t.id}')" class="boton-secundario" style="padding:5px 10px; font-size:11px; color:var(--negro); border-color:var(--negro); cursor:pointer;">
            ${t.activo ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    `).join('');

    renderParticipantes();
  };

  window.cambiarEstadoTorneo = (id) => {
    const torneos = FutPlayAuth.obtenerTorneos();
    const t = torneos.find(item => item.id === id);
    if (t) {
      t.activo = !t.activo;
      FutPlayAuth.guardarTorneos(torneos);
      renderTorneos();
      Swal.fire({ icon: 'info', title: 'Estado Cambiado', text: `El torneo ahora está ${t.activo ? 'Activo' : 'Inactivo'}.`, confirmButtonColor: '#0268fb' });
    }
  };

  const renderParticipantes = () => {
    const torneos = FutPlayAuth.obtenerTorneos();
    const cont = document.getElementById('tabla-participantes');

    cont.innerHTML = torneos.map(t => `
      <div style="background:var(--claro); padding:15px; border-radius:6px; margin-bottom:15px; border:1px solid var(--linea);">
        <h4 style="font-size:18px; color:var(--negro); margin-bottom:10px;">${t.nombre}</h4>
        
        <p><strong>Equipos Inscritos:</strong></p>
        <ul style="margin-left:20px; font-size:14px;">
          ${(t.equipos || []).length ? t.equipos.map((eq, idx) => `
            <li style="margin-bottom:5px;">
              ${eq} 
              <button onclick="expulsarParticipante('${t.id}', 'equipo', ${idx})" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold; margin-left:10px;">[Expulsar]</button>
            </li>
          `).join('') : '<li style="color:var(--gris);">Sin equipos afiliados.</li>'}
        </ul>

        <p style="margin-top:10px;"><strong>Jugadores Individuales:</strong></p>
        <ul style="margin-left:20px; font-size:14px;">
          ${(t.jugadores || []).length ? t.jugadores.map((jug, idx) => `
            <li style="margin-bottom:5px;">
              ${jug} 
              <button onclick="expulsarParticipante('${t.id}', 'jugador', ${idx})" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold; margin-left:10px;">[Expulsar]</button>
            </li>
          `).join('') : '<li style="color:var(--gris);">Sin jugadores afiliados.</li>'}
        </ul>
      </div>
    `).join('');
  };

  window.expulsarParticipante = (torneoId, tipo, index) => {
    const torneos = FutPlayAuth.obtenerTorneos();
    const t = torneos.find(item => item.id === torneoId);
    if (t) {
      if (tipo === 'equipo') t.equipos.splice(index, 1);
      if (tipo === 'jugador') t.jugadores.splice(index, 1);
      FutPlayAuth.guardarTorneos(torneos);
      renderTorneos();
      Swal.fire({ icon: 'success', title: 'Participante Expulsado', text: 'Se ha removido correctamente del torneo.', confirmButtonColor: '#0268fb' });
    }
  };

  document.getElementById('form-crear-torneo').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('t-nombre').value.trim();
    const imagen = document.getElementById('t-imagen').value.trim();
    const valorPersona = parseInt(document.getElementById('t-valor-persona').value) || 0;
    const valorEquipo = parseInt(document.getElementById('t-valor-equipo').value) || 0;
    const descripcion = document.getElementById('t-desc').value.trim();

    if (descripcion.length < 100 || descripcion.length > 500) {
      return Swal.fire({ icon: 'warning', title: 'Descripción inválida', text: 'La descripción debe tener entre 100 y 500 caracteres.', confirmButtonColor: '#0268fb' });
    }

    const nuevo = {
      id: 't_' + Date.now(),
      nombre, imagen, valorPersona, valorEquipo, descripcion, activo: true, equipos: [], jugadores: []
    };

    const torneos = FutPlayAuth.obtenerTorneos();
    torneos.push(nuevo);
    FutPlayAuth.guardarTorneos(torneos);
    renderTorneos();
    document.getElementById('form-crear-torneo').reset();
    counter.textContent = '0 / 500 caracteres';
    Swal.fire({ icon: 'success', title: 'Torneo Publicado', text: 'El torneo se creó exitosamente.', confirmButtonColor: '#0268fb' });
  });

  document.getElementById('form-afiliar').addEventListener('submit', (e) => {
    e.preventDefault();
    const idTorneo = document.getElementById('a-torneo').value;
    const tipo = document.getElementById('a-tipo').value;
    const nombre = document.getElementById('a-nombre').value.trim();

    const torneos = FutPlayAuth.obtenerTorneos();
    const t = torneos.find(item => item.id === idTorneo);
    if (t) {
      if (tipo === 'equipo') {
        t.equipos = t.equipos || [];
        t.equipos.push(nombre);
      } else {
        t.jugadores = t.jugadores || [];
        t.jugadores.push(nombre);
      }
      FutPlayAuth.guardarTorneos(torneos);
      renderTorneos();
      document.getElementById('a-nombre').value = '';
      Swal.fire({ icon: 'success', title: 'Afiliación Exitosa', text: `${nombre} fue afiliado a ${t.nombre}.`, confirmButtonColor: '#0268fb' });
    }
  });

  renderTorneos();
});
