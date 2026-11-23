document.addEventListener('DOMContentLoaded', () => {
  const usuario = FutPlayAuth.requerirSesion('arbitro');
  if (!usuario) return;

  document.getElementById('usr-nombre').textContent = usuario.nombre || usuario.correo;
  document.getElementById('btn-logout').addEventListener('click', () => FutPlayAuth.cerrarSesion());

  const renderCombos = () => {
    const torneos = FutPlayAuth.obtenerTorneos();
    const options = torneos.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('');
    document.getElementById('arb-torneo-sel').innerHTML = options;
    document.getElementById('p-torneo').innerHTML = options;
    document.getElementById('tj-torneo').innerHTML = options;
  };

  const renderSolicitudes = () => {
    const lista = FutPlayAuth.obtenerSolicitudesArbitro();
    const torneos = FutPlayAuth.obtenerTorneos();
    const tbody = document.getElementById('tabla-solicitudes-arb');

    if (!lista.length) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--gris);">No has solicitado afiliaciones aún.</td></tr>';
      return;
    }

    tbody.innerHTML = lista.map(s => {
      const t = torneos.find(item => item.id === s.torneoId);
      return `
        <tr>
          <td><strong>${t ? t.nombre : s.torneoId}</strong></td>
          <td>$${parseInt(s.tarifa).toLocaleString()} COP</td>
          <td><span class="badge-status badge-aceptado">ACEPTADO (AFILIADO)</span></td>
        </tr>
      `;
    }).join('');
  };

  document.getElementById('form-solicitar-arb').addEventListener('submit', (e) => {
    e.preventDefault();
    const torneoId = document.getElementById('arb-torneo-sel').value;
    const tarifa = document.getElementById('arb-tarifa').value;

    const lista = FutPlayAuth.obtenerSolicitudesArbitro();
    lista.push({ torneoId, tarifa, estado: 'aceptado', arbitro: usuario.correo });
    FutPlayAuth.guardarSolicitudesArbitro(lista);
    renderSolicitudes();
    Swal.fire({ icon: 'success', title: 'Afiliación Aprobada', text: 'Has sido afiliado al torneo como árbitro oficial.', confirmButtonColor: '#0268fb' });
  });

  const renderPosiciones = () => {
    const lista = FutPlayAuth.obtenerPosiciones();
    const tbody = document.getElementById('tabla-posiciones-body');

    if (!lista.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--gris);">Sin registros de posiciones.</td></tr>';
      return;
    }

    tbody.innerHTML = lista.map(p => `
      <tr>
        <td><strong>${p.equipo}</strong></td>
        <td>${p.pj}</td>
        <td>${p.pg}</td>
        <td>${p.pe}</td>
        <td>${p.pp}</td>
        <td>${p.gf}</td>
        <td>${p.gc}</td>
        <td><strong style="color:var(--azul);">${p.pts}</strong></td>
      </tr>
    `).join('');
  };

  document.getElementById('form-posicion').addEventListener('submit', (e) => {
    e.preventDefault();
    const torneoId = document.getElementById('p-torneo').value;
    const equipo = document.getElementById('p-equipo').value.trim();
    const pj = parseInt(document.getElementById('p-pj').value) || 0;
    const pg = parseInt(document.getElementById('p-pg').value) || 0;
    const pe = parseInt(document.getElementById('p-pe').value) || 0;
    const pp = parseInt(document.getElementById('p-pp').value) || 0;
    const gf = parseInt(document.getElementById('p-gf').value) || 0;
    const gc = parseInt(document.getElementById('p-gc').value) || 0;
    const pts = (pg * 3) + (pe * 1);

    const lista = FutPlayAuth.obtenerPosiciones();
    const idx = lista.findIndex(item => item.torneoId === torneoId && item.equipo.toLowerCase() === equipo.toLowerCase());

    const registro = { torneoId, equipo, pj, pg, pe, pp, gf, gc, pts };
    if (idx >= 0) {
      lista[idx] = registro;
    } else {
      lista.push(registro);
    }

    FutPlayAuth.guardarPosiciones(lista);
    renderPosiciones();
    document.getElementById('form-posicion').reset();
    Swal.fire({ icon: 'success', title: 'Tabla Actualizada', text: `Estadísticas guardadas para ${equipo}.`, confirmButtonColor: '#0268fb' });
  });

  const renderTarjetas = () => {
    const lista = FutPlayAuth.obtenerTarjetas();
    const tbody = document.getElementById('tabla-tarjetas-body');

    if (!lista.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--gris);">No hay tarjetas sancionadas aún.</td></tr>';
      return;
    }

    tbody.innerHTML = lista.map(t => {
      let badge = `<span class="tarjeta-amarilla">Amarilla</span>`;
      if (t.tipo === 'roja') badge = `<span class="tarjeta-roja">Roja</span>`;
      if (t.tipo === 'azul') badge = `<span class="tarjeta-azul">Azul</span>`;

      return `
        <tr>
          <td><strong>${t.jugador}</strong></td>
          <td>${t.equipo}</td>
          <td>${badge}</td>
          <td>${t.motivo}</td>
        </tr>
      `;
    }).join('');
  };

  document.getElementById('form-tarjeta').addEventListener('submit', (e) => {
    e.preventDefault();
    const torneoId = document.getElementById('tj-torneo').value;
    const equipo = document.getElementById('tj-equipo').value.trim();
    const jugador = document.getElementById('tj-jugador').value.trim();
    const tipo = document.getElementById('tj-tipo').value;
    const motivo = document.getElementById('tj-motivo').value.trim();

    const lista = FutPlayAuth.obtenerTarjetas();
    lista.push({ torneoId, equipo, jugador, tipo, motivo });
    FutPlayAuth.guardarTarjetas(lista);
    renderTarjetas();
    document.getElementById('form-tarjeta').reset();
    Swal.fire({ icon: 'success', title: 'Tarjeta Registrada', text: `Se aplicó tarjeta ${tipo} a ${jugador}.`, confirmButtonColor: '#0268fb' });
  });

  renderCombos();
  renderSolicitudes();
  renderPosiciones();
  renderTarjetas();
});
