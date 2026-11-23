const FutPlayValidar = {
  regexCorreo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  erroresContrasena(pass) {
    const errores = [];
    if (pass.length < 8) errores.push('al menos 8 caracteres');
    if (!/[A-Z]/.test(pass)) errores.push('una letra mayúscula');
    if (!/[a-z]/.test(pass)) errores.push('una letra minúscula');
    if (!/[0-9]/.test(pass)) errores.push('un número');
    return errores;
  }
};
