const createBookAction = require('./actions/create.book.action');
const readBooksAction = require('./actions/read.books.action'); // <--- Importar
const readBookDetailsAction = require('./actions/read.book.details.action'); // <--- Importar
const updateBookAction = require('./actions/update.book.action'); // <--- Importar
const deleteBookAction = require('./actions/delete.book.action'); // <--- Importar
const reserveBookAction = require('./actions/reserve.book.action');
const returnBookAction = require('./actions/return.book.action'); // <--- Importar

async function createBookController(bookData, user) {
  // ... (tu código anterior de crear) ...
    if (!user.permisos.crearLibros) {
    throw new Error("No tienes permisos para crear libros");
  }
  const newBook = await createBookAction(bookData);
  return newBook;
}

// Nueva función
async function readBooksController(queryParams) {
  // Separamos los parámetros de paginación de los filtros
  const { page, limit, ...filtro } = queryParams;
  
  const resultados = await readBooksAction({ filtro, page, limit });
  return resultados;
}

async function readBookDetailsController(id) {
  const book = await readBookDetailsAction(id);
  return book;
}

// Nueva función UPDATE
async function updateBookController(id, bookData, user) {
  // 1. Verificación de Seguridad 
  if (!user.permisos.modificarLibros) {
    throw new Error("No tienes permisos para modificar libros");
  }

  // 2. Llamar a la acción
  const updatedBook = await updateBookAction(id, bookData);
  return updatedBook;
}

async function deleteBookController(id, user) {
  // 1. Verificación de Seguridad
  if (!user.permisos.inhabilitarLibros) {
    throw new Error("No tienes permisos para inhabilitar libros");
  }

  // 2. Llamar a la acción
  const deletedBook = await deleteBookAction(id);
  return deletedBook;
}

async function reserveBookController(bookId, userId) {
  // Simplemente llamamos a la acción
  const book = await reserveBookAction(bookId, userId);
  return book;
}

async function returnBookController(bookId) {
  const book = await returnBookAction(bookId);
  return book;
}

module.exports = {
  createBookController,
  readBooksController,
  readBookDetailsController,
  updateBookController,
  deleteBookController,
  reserveBookController,
  returnBookController // <--- Exportar
};