const User = require('../user.model');

async function readUsersAction() {
  // Buscamos usuarios activos.
  // .select('nombre _id') -> SOLO trae el nombre y el ID. Nada más.
  // Esto aumenta la seguridad al no exponer emails ni permisos de todos.
  const users = await User.find({ isActive: true }).select('nombre _id');

  return users;
}

module.exports = readUsersAction;