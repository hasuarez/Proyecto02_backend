const Book = require('../book.model');

async function createBookAction(bookData) {
  // Aquí podríamos agregar lógica extra, como verificar si el ISBN ya existe, etc.
  const newBook = await Book.create(bookData);
  return newBook;
}

module.exports = createBookAction;