const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user.model');

async function loginUserAction({ email, password }) {
  // 1. Buscar al usuario por email
  // Incluimos '+password' porque en algunos modelos se oculta por defecto, 
  // aquí la necesitamos para comparar.
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Credenciales inválidas'); // Por seguridad, no digas "Usuario no existe"
  }

  // 2. Verificar la contraseña
  // Usamos bcrypt.compare para ver si el texto plano coincide con el hash guardado
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Credenciales inválidas'); // Misma respuesta para no dar pistas a hackers
  }

  // 3. Generar el Token (JWT) [cite: 174-175]
  // En el "payload" guardamos el ID y los permisos para usarlos luego
  const payload = {
    id: user._id,
    permisos: user.permisos
  };

  // Firmamos el token usando el secreto del .env
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d' // El token dura 1 día
  });

  return { user, token };
}

module.exports = loginUserAction;   