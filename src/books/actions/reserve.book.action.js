const Book = require('../book.model');
const User = require('../../users/user.model'); // Importamos el modelo de usuario

async function reserveBookAction(bookId, userId) {
  // 1. Buscar el libro para ver si está disponible
  const book = await Book.findById(bookId);

  if (!book || !book.isActive) {
    throw new Error("Libro no encontrado");
  }

  if (book.disponibilidad === false) {
    throw new Error("El libro ya está reservado por otra persona");
  }

  // 2. Actualizar el Libro
  // - Lo marcamos como no disponible
  // - Agregamos la entrada al historial
  book.disponibilidad = false;
  book.historialReservas.push({
    usuarioId: userId,
    fechaReserva: new Date()
    // fechaEntrega se queda vacía por ahora
  });
  await book.save(); // Guardamos los cambios en el libro

  // 3. Actualizar el Usuario
  // - Buscamos al usuario y agregamos el libro a su historial
  const user = await User.findById(userId);
  if (user) {
    user.historialReservas.push({
      libroId: book._id,
      tituloLibro: book.titulo, // Guardamos el título como pide el requisito
      fechaReserva: new Date()
    });
    await user.save(); // Guardamos los cambios en el usuario
  }

  return book;
}

module.exports = reserveBookAction;