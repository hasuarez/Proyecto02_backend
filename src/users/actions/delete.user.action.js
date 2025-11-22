const User = require('../user.model');

async function deleteUserAction(id) {
  // Soft Delete: isActive = false
  const deletedUser = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).select('-password');

  if (!deletedUser) throw new Error("Usuario no encontrado");

  return deletedUser;
}

module.exports = deleteUserAction;