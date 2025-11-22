const User = require('../user.model');

async function readUserDetailsAction(id) {
  // Buscamos por ID
  // .select('-password') -> Trae TODO menos la contraseña
  const user = await User.findById(id).select('-password');

  if (!user || user.isActive === false) {
    throw new Error("Usuario no encontrado");
  }

  return user;
}

module.exports = readUserDetailsAction;