const FutPlayAuth = {
  CLAVE_USUARIOS: 'futplay_usuarios_v2',
  CLAVE_SESION: 'futplay_sesion_activa_v2',
  CLAVE_TORNEOS: 'futplay_torneos_v2',
  CLAVE_INVENTARIO: 'futplay_inventario_v2',
  CLAVE_INVITACIONES: 'futplay_invitaciones_v2',
  CLAVE_TARJETAS: 'futplay_tarjetas_v2',
  CLAVE_POSICIONES: 'futplay_posiciones_v2',
  CLAVE_ARBITROS_SOLICITUDES: 'futplay_arbitros_solicitudes_v2',

  PANELES: {
    admin: 'dashboard-admin.html',
    jugador: 'dashboard.html',
    arbitro: 'dashboard-arbitro.html',
    entrenador: 'dashboard-entrenador.html',
    organizador: 'dashboard-organizador.html'
  },

  USUARIOS_ADMINISTRADORES: [
    { nombre: 'Kevin Escobar B', correo: 'kevin.escobar@futplay.com', pass: 'Kevin.Escobar2008', rol: 'Administrador del Sistema', rolCodigo: 'admin' },
    { nombre: 'Brandon Bolaños', correo: 'brandon.bolanos@futplay.com', pass: 'Brandon.Bolaños2009', rol: 'Administrador del Sistema', rolCodigo: 'admin' }
  ],

  obtenerUsuarios() {
    try { 
      let lista = JSON.parse(localStorage.getItem(this.CLAVE_USUARIOS)) || [];
      // Verificar si los administradores ya estan guardados
      this.USUARIOS_ADMINISTRADORES.forEach(admin => {
        if (!lista.some(u => u.correo.toLowerCase() === admin.correo.toLowerCase())) {
          lista.push({
            nombre: admin.nombre,
            correo: admin.correo,
            telefono: '3000000000',
            rol: admin.rol,
            rolCodigo: admin.rolCodigo,
            sal: 'sal_admin_sena',
            hash: 'hash_admin_' + admin.pass
          });
        }
      });
      return lista;
    } catch { return []; }
  },
  guardarUsuarios(l) { localStorage.setItem(this.CLAVE_USUARIOS, JSON.stringify(l)); },

  obtenerTorneos() {
    try {
      const t = JSON.parse(localStorage.getItem(this.CLAVE_TORNEOS));
      if (t && t.length) return t;
    } catch {}
    const iniciales = [
      { id: 't1', nombre: 'Copa FUTPLAY 2026', descripcion: 'El torneo oficial de microfútbol más relevante de la región para equipos de nivel libre que buscan alta competencia.', imagen: 'imágenes/torneo1.svg', valorPersona: 25000, valorEquipo: 200000, activo: true, equipos: ['Depor FC', 'Titanio FC'], jugadores: ['Juan Pérez (Depor FC)'] },
      { id: 't2', nombre: 'Torneo Barrio Unido', descripcion: 'Competencia comunitaria orientada a fortalecer la integración y el juego limpio entre barrios locales.', imagen: 'imágenes/torneo2.svg', valorPersona: 15000, valorEquipo: 120000, activo: true, equipos: ['Barrio Alto FC'], jugadores: [] }
    ];
    localStorage.setItem(this.CLAVE_TORNEOS, JSON.stringify(iniciales));
    return iniciales;
  },
  guardarTorneos(l) { localStorage.setItem(this.CLAVE_TORNEOS, JSON.stringify(l)); },

  obtenerInventario() {
    try {
      const inv = JSON.parse(localStorage.getItem(this.CLAVE_INVENTARIO));
      if (inv) return inv;
    } catch {}
    const def = { balones: 10, conos: 25, platillos: 30, setas: 20, escaleras: 4, vallas: 8, petos: 18 };
    localStorage.setItem(this.CLAVE_INVENTARIO, JSON.stringify(def));
    return def;
  },
  guardarInventario(inv) { localStorage.setItem(this.CLAVE_INVENTARIO, JSON.stringify(inv)); },

  obtenerInvitaciones() {
    try { return JSON.parse(localStorage.getItem(this.CLAVE_INVITACIONES)) || []; } catch { return []; }
  },
  guardarInvitaciones(l) { localStorage.setItem(this.CLAVE_INVITACIONES, JSON.stringify(l)); },

  obtenerSolicitudesArbitro() {
    try { return JSON.parse(localStorage.getItem(this.CLAVE_ARBITROS_SOLICITUDES)) || []; } catch { return []; }
  },
  guardarSolicitudesArbitro(l) { localStorage.setItem(this.CLAVE_ARBITROS_SOLICITUDES, JSON.stringify(l)); },

  obtenerTarjetas() {
    try { return JSON.parse(localStorage.getItem(this.CLAVE_TARJETAS)) || []; } catch { return []; }
  },
  guardarTarjetas(l) { localStorage.setItem(this.CLAVE_TARJETAS, JSON.stringify(l)); },

  obtenerPosiciones() {
    try {
      const pos = JSON.parse(localStorage.getItem(this.CLAVE_POSICIONES));
      if (pos) return pos;
    } catch {}
    const def = [
      { torneoId: 't1', equipo: 'Depor FC', pj: 3, pg: 2, pe: 1, pp: 0, gf: 8, gc: 3, pts: 7 },
      { torneoId: 't1', equipo: 'Titanio FC', pj: 3, pg: 1, pe: 1, pp: 1, gf: 5, gc: 5, pts: 4 }
    ];
    localStorage.setItem(this.CLAVE_POSICIONES, JSON.stringify(def));
    return def;
  },
  guardarPosiciones(l) { localStorage.setItem(this.CLAVE_POSICIONES, JSON.stringify(l)); },

  buscarPorCorreo(correo) {
    const c = (correo || '').toLowerCase().trim();
    return this.obtenerUsuarios().find(u => (u.correo || '').toLowerCase().trim() === c);
  },

  nuevaSal() {
    const a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
  },

  async hashear(textoPlano, sal) {
    if (sal === 'sal_admin_sena') {
      return 'hash_admin_' + textoPlano;
    }
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(textoPlano + sal), { name: 'PBKDF2' }, false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({
      name: 'PBKDF2', salt: enc.encode(sal), iterations: 25000, hash: 'SHA-256'
    }, key, 256);
    return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
  },

  abrirSesion(usuario) {
    const copia = { ...usuario };
    delete copia.hash; delete copia.sal;
    sessionStorage.setItem(this.CLAVE_SESION, JSON.stringify(copia));
  },

  obtenerSesion() {
    try { return JSON.parse(sessionStorage.getItem(this.CLAVE_SESION)); } catch { return null; }
  },

  cerrarSesion() {
    sessionStorage.removeItem(this.CLAVE_SESION);
    window.location.href = 'login.html';
  },

  requerirSesion(rolPermitido) {
    const s = this.obtenerSesion();
    if (!s) { window.location.href = 'login.html'; return null; }
    if (rolPermitido && s.rolCodigo !== rolPermitido && s.rolCodigo !== 'admin') {
      window.location.href = this.PANELES[s.rolCodigo] || 'login.html';
      return null;
    }
    return s;
  },

  redirigirSiHaySesion() {
    const s = this.obtenerSesion();
    if (s && s.rolCodigo && this.PANELES[s.rolCodigo]) {
      window.location.href = this.PANELES[s.rolCodigo];
    }
  }
};
