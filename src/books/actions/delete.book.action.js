const Book = require('../book.model');

async function deleteBookAction(id) {
  // Soft Delete: No borramos, solo actualizamos isActive a false
  const deletedBook = await Book.findByIdAndUpdate(
    id, 
    { isActive: false }, 
    { new: true } // Para que nos devuelva el libro con el cambio aplicado
  );

  if (!deletedBook) {
    throw new Error("Libro no encontrado");
  }

  return deletedBook;
}

module.exports = deleteBookAction;