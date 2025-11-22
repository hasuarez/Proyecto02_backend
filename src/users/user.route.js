const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware'); // Importar portero
const { 
  createUserController, 
  loginUserController, 
  updateUserController, 
  deleteUserController,
  readUsersController,
  readUserDetailsController
} = require('./user.controller');
// Definimos el endpoint POST "/"
// Capa 2: Recibe el request y extrae datos [cite: 81-83]
router.post('/', async (req, res) => {
  try {
    // Extraemos los datos del body del request
    const userData = req.body;

    // Llamamos al controlador con los datos limpios
    const newUser = await createUserController(userData);

    // Respondemos al cliente (Frontend/Postman)
    res.status(201).json({
      message: "Usuario creado con éxito",
      user: newUser
    });
  } catch (error) {
    // Manejo de errores (ej. email duplicado)
    res.status(400).json({
      message: "Error al crear usuario",
      error: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserController({ email, password });
    
    res.status(200).json({
      message: "Login exitoso",
      token: result.token, // Entregamos el token al usuario
      user: result.user
    });
  } catch (error) {
    res.status(401).json({ // 401 significa "No autorizado"
      message: "Error en autenticación",
      error: error.message
    });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await readUsersController(req.query); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al listar usuarios" });
  }
});

// GET /users/:id (Ver detalle de UN usuario)
// Requisito: Seguridad -> Agregamos authMiddleware
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await readUserDetailsController(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // A quién queremos modificar
    const data = req.body;     // Qué queremos cambiar
    const user = req.user;     // Quién está haciendo la petición

    const result = await updateUserController(id, data, user);
    res.status(200).json({ message: "Usuario actualizado", user: result });
  } catch (error) {
    const status = error.message.includes("permisos") ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

// DELETE /users/:id (Inhabilitar)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const result = await deleteUserController(id, user);
    res.status(200).json({ message: "Usuario inhabilitado", user: result });
  } catch (error) {
    const status = error.message.includes("permisos") ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});


module.exports = router;