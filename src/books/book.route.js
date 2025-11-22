const express = require('express');
const router = express.Router();
const { createBookController, 
        readBooksController, 
        readBookDetailsController, 
        updateBookController, 
        deleteBookController ,
        returnBookController, 
        reserveBookController} = require('./book.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // Importamos al portero

// POST /books
// Agregamos authMiddleware como SEGUNDO parámetro. 
// Express ejecuta las funciones en orden: 1. authMiddleware -> 2. la función de la ruta.
router.post('/', authMiddleware, async (req, res) => {
  try {
    // req.user existe gracias al middleware
    const bookData = req.body;
    const user = req.user; 

    const newBook = await createBookController(bookData, user);

    res.status(201).json({
      message: "Libro creado exitosamente",
      book: newBook
    });
  } catch (error) {
    // Si el error es de permisos, devolvemos 403 (Forbidden), sino 400
    const status = error.message.includes("permisos") ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

// GET /books
router.get('/', async (req, res) => {
  try {
    const queryParams = req.query;
    const resultados = await readBooksController(queryParams);
    res.json(resultados);
  } catch (error) {
    const status = error.message.includes("permisos") ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Express saca el ID de la URL aquí
    const book = await readBookDetailsController(id);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// PATCH /books/:id
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // Sacamos ID de la URL
    const changes = req.body;  // Sacamos datos del Body
    const user = req.user;     // Sacamos usuario del Token

    const book = await updateBookController(id, changes, user);

    res.status(200).json({
      message: "Libro actualizado",
      book
    });
  } catch (error) {
    const status = error.message.includes("permisos") ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const book = await deleteBookController(id, user);

    res.status(200).json({
      message: "Libro inhabilitado exitosamente",
      book // Devolvemos el libro para mostrar que isActive ahora es false
    });
  } catch (error) {
    const status = error.message.includes("permisos") ? 403 : 404;
    res.status(status).json({ message: error.message });
  }
});

router.post('/:id/reservar', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // ID del libro
    const userId = req.user.id; // ID del usuario (viene del Token)

    const book = await reserveBookController(id, userId);

    res.status(200).json({
      message: "Libro reservado con éxito",
      book
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /books/:id/devolver
router.post('/:id/devolver', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // ID del libro

    const book = await returnBookController(id);

    res.status(200).json({
      message: "Libro devuelto con éxito",
      book
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;