const Book = require('../book.model');

async function updateBookAction(id, changes) {
  // 1. Buscamos y actualizamos en un solo paso
  // { new: true } es VITAL: le dice a Mongo que nos devuelva el libro YA editado, no el viejo.
  // runValidators: true asegura que si mandas un dato invalido, Mongo se queje.
  const updatedBook = await Book.findByIdAndUpdate(id, changes, {
    new: true,
    runValidators: true
  });

  if (!updatedBook) {
    throw new Error("Libro no encontrado");
  }

  return updatedBook;
}

module.exports = updateBookAction;