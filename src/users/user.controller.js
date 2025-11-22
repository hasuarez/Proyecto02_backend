const createUserAction = require('./actions/create.user.action');
const loginUserAction = require('./actions/login.user.action'); 
const updateUserAction = require('./actions/update.user.action'); // Importar
const deleteUserAction = require('./actions/delete.user.action'); //
const readUsersAction = require('./actions/read.users.action');
const readUserDetailsAction = require('./actions/read.user.details.action');

async function createUserController(userData) {
  const newUser = await createUserAction(userData);
  return newUser;
}

// Nueva función para el Login
async function loginUserController(credentials) {
  const result = await loginUserAction(credentials);
  return result;
}

async function updateUserController(idToUpdate, data, userMakingRequest) {
  // Validar: ¿Soy yo mismo? (Comparamos IDs)
  const isSelf = userMakingRequest.id === idToUpdate;
  // Validar: ¿Tengo permiso de modificar a otros?
  const canModifyOthers = userMakingRequest.permisos.modificarUsuarios;

  if (!isSelf && !canModifyOthers) {
    throw new Error("No tienes permisos para modificar este usuario");
  }

  return await updateUserAction(idToUpdate, data);
}

// Función DELETE
async function deleteUserController(idToDelete, userMakingRequest) {
  const isSelf = userMakingRequest.id === idToDelete;
  const canDeleteOthers = userMakingRequest.permisos.inhabilitarUsuarios;

  if (!isSelf && !canDeleteOthers) {
    throw new Error("No tienes permisos para inhabilitar este usuario");
  }

  return await deleteUserAction(idToDelete);
}



async function readUsersController() {
  return await readUsersAction();
}

// 2. Leer Un Usuario Específico
async function readUserDetailsController(id) {
  // Aquí podrías agregar lógica de "¿Es mi perfil?", pero el requerimiento 
  // solo dice "Retorna la información de un usuario" y "Debe ser seguro".
  // La seguridad la manejaremos principalmente con el Token en la ruta.
  return await readUserDetailsAction(id);
}

module.exports = {
  createUserController,
  loginUserController,
  updateUserController,
  deleteUserController,
  readUsersController,      // <--- Exportar
  readUserDetailsController // <--- Exportar
};