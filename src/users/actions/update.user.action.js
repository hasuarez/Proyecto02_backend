const User = require('../user.model');
const bcrypt = require('bcrypt');

async function updateUserAction(id, data) {
  // Si intentan actualizar la contraseña, hay que encriptarla de nuevo
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).select('-password'); // Excluimos la contraseña del resultado por seguridad

  if (!updatedUser) throw new Error("Usuario no encontrado");
  
  return updatedUser;
}

module.exports = updateUserAction;