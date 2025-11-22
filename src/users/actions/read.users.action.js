const User = require('../user.model');

// El controlador de usuarios no pasaba argumentos antes, 
// ahora necesitamos recibir el 'includeDeleted' desde el query.
async function readUsersAction(filters = {}) {
  const query = {};

  // Si NO piden explícitamente los borrados, solo traemos los activos
  if (filters.includeDeleted !== 'true') {
    query.isActive = true;
  }

  const users = await User.find(query).select('nombre _id isActive');

  return users;
}

module.exports = readUsersAction;