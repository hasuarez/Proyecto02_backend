// 1. Importamos TODOS los controladores
const { 
  createUserController, 
  loginUserController, 
  updateUserController, 
  deleteUserController 
} = require('./user.controller');

// 2. Importamos TODAS las acciones
const createUserAction = require('./actions/create.user.action');
const loginUserAction = require('./actions/login.user.action');
const updateUserAction = require('./actions/update.user.action'); // <--- Nuevo
const deleteUserAction = require('./actions/delete.user.action'); // <--- Nuevo

// 3. Mockeamos TODAS las acciones
jest.mock('./actions/create.user.action');
jest.mock('./actions/login.user.action');
jest.mock('./actions/update.user.action'); // <--- Nuevo
jest.mock('./actions/delete.user.action'); // <--- Nuevo

describe('User Controller', () => {

  // --- PRUEBA 1: CREAR USUARIO (CREATE) ---
  describe('createUserController', () => {
    
    it('Debe crear un usuario exitosamente', async () => {
      // A. ARRANGE (Preparar)
      const mockUserData = { nombre: 'Juan', email: 'juan@test.com', password: '123' };
      const mockCreatedUser = { _id: '1', ...mockUserData, password: 'hashed_123' };
      
      // Enseñamos al Mock qué responder cuando lo llamen (Caso Exitoso)
      createUserAction.mockResolvedValue(mockCreatedUser);

      // B. ACT (Actuar)
      const result = await createUserController(mockUserData);

      // C. ASSERT (Verificar)
      expect(result).toEqual(mockCreatedUser); // ¿El resultado es el esperado?
      expect(createUserAction).toHaveBeenCalledWith(mockUserData); // ¿Se llamó a la acción correcta?
    });

    it('Debe lanzar un error si la acción falla', async () => {
      // A. ARRANGE
      // Enseñamos al Mock a fallar (Caso Fallido)
      const errorMessage = 'El email ya existe';
      createUserAction.mockRejectedValue(new Error(errorMessage));

      // B. ACT & C. ASSERT
      // Esperamos que al llamar la función, explote con el error esperado
      await expect(createUserController({}))
        .rejects
        .toThrow(errorMessage);
    });
  });

  // --- PRUEBA 2: LOGIN USUARIO ---
  describe('loginUserController', () => {

    it('Debe loguear al usuario y devolver token', async () => {
      // Preparar
      const credentials = { email: 'juan@test.com', password: '123' };
      const mockResponse = { user: { _id: '1' }, token: 'fake_token_abc' };
      
      // Simulamos que el login es exitoso
      loginUserAction.mockResolvedValue(mockResponse);

      // Actuar
      const result = await loginUserController(credentials);

      // Verificar
      expect(result).toEqual(mockResponse);
      expect(loginUserAction).toHaveBeenCalledWith(credentials);
    });

    it('Debe lanzar error con credenciales incorrectas', async () => {
      // Preparar
      loginUserAction.mockRejectedValue(new Error('Credenciales inválidas'));

      // Verificar que falle
      await expect(loginUserController({}))
        .rejects
        .toThrow('Credenciales inválidas');
    });
  });

});

// --- PRUEBA 3: ACTUALIZAR USUARIO (UPDATE) ---
  describe('updateUserController', () => {
    it('Debe actualizar el usuario si tiene permisos (Es el mismo usuario)', async () => {
      // Arrange
      const idToUpdate = 'user123';
      const dataToUpdate = { nombre: 'Juan Updated' };
      // Simulamos que soy yo mismo quien pide el cambio
      const userMakingRequest = { id: 'user123', permisos: {} }; 
      const mockUpdatedUser = { _id: 'user123', nombre: 'Juan Updated' };

      updateUserAction.mockResolvedValue(mockUpdatedUser);

      // Act
      const result = await updateUserController(idToUpdate, dataToUpdate, userMakingRequest);

      // Assert
      expect(result).toEqual(mockUpdatedUser);
    });

    it('Debe lanzar error si NO tiene permisos', async () => {
      // Arrange
      const idToUpdate = 'user123';
      const dataToUpdate = { nombre: 'Hacker' };
      // Soy OTRO usuario y NO tengo permisos
      const userMakingRequest = { id: 'otherUser', permisos: { modificarUsuarios: false } };

      // Act & Assert
      // Esperamos que falle SIN siquiera llamar a la acción de base de datos
      await expect(updateUserController(idToUpdate, dataToUpdate, userMakingRequest))
        .rejects
        .toThrow('No tienes permisos');
    });
  });

  // --- PRUEBA 4: INHABILITAR USUARIO (DELETE) ---
  describe('deleteUserController', () => {
    it('Debe inhabilitar usuario si es Admin', async () => {
      // Arrange
      const idToDelete = 'user123';
      // Soy OTRO usuario pero soy ADMIN
      const userMakingRequest = { id: 'adminUser', permisos: { inhabilitarUsuarios: true } };
      const mockDeletedUser = { _id: 'user123', isActive: false };

      deleteUserAction.mockResolvedValue(mockDeletedUser);

      // Act
      const result = await deleteUserController(idToDelete, userMakingRequest);

      // Assert
      expect(result).toEqual(mockDeletedUser);
    });

    it('Debe lanzar error si la acción de borrado falla (ej. no encontrado)', async () => {
      // Arrange
      const idToDelete = 'user123';
      const userMakingRequest = { id: 'user123', permisos: {} }; // Es el mismo usuario (tiene permiso)
      
      // Simulamos que la BD falló o no encontró al usuario
      deleteUserAction.mockRejectedValue(new Error('Usuario no encontrado'));

      // Act & Assert
      await expect(deleteUserController(idToDelete, userMakingRequest))
        .rejects
        .toThrow('Usuario no encontrado');
    });
  });