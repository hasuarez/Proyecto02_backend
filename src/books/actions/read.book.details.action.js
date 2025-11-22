const Book = require('../book.model');

async function readBookDetailsAction(id) {
  // Buscamos por ID
  const book = await Book.findById(id);

  // Si no existe, o si fue borrado (Soft Delete), lanzamos error
  if (!book || book.isActive === false) {
    throw new Error("Libro no encontrado");
  }

  return book; // Aquí sí retornamos TODO el objeto
}

module.exports = readBookDetailsAction;