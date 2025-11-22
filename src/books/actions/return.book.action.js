const Book = require('../book.model');
const User = require('../../users/user.model');

async function returnBookAction(bookId) {
  // 1. Buscar el libro
  const book = await Book.findById(bookId);

  if (!book) throw new Error("Libro no encontrado");
  
  // Si ya está disponible, nadie lo tiene prestado
  if (book.disponibilidad === true) {
    throw new Error("El libro no está prestado actualmente");
  }

  // 2. Cerrar el historial del LIBRO
  // Buscamos la última reserva del array (que es la actual)
  const ultimaReserva = book.historialReservas[book.historialReservas.length - 1];
  
  // Ponemos la fecha de entrega de HOY
  ultimaReserva.fechaEntrega = new Date();
  
  // Liberamos el libro
  book.disponibilidad = true;
  await book.save();

  // 3. Cerrar el historial del USUARIO
  // Usamos el ID que estaba guardado en la reserva del libro
  const userId = ultimaReserva.usuarioId;
  const user = await User.findById(userId);

  if (user) {
    // Buscamos en el historial del usuario la entrada de este libro que NO tenga fecha de entrega
    const reservaUsuario = user.historialReservas.find(
      r => r.libroId.toString() === bookId && !r.fechaEntrega
    );

    if (reservaUsuario) {
      reservaUsuario.fechaEntrega = new Date();
      await user.save();
    }
  }

  return book;
}

module.exports = returnBookAction;