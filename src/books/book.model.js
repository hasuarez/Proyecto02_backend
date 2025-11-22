const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  genero: { type: String },
  casaEditorial: { type: String },
  fechaPublicacion: { type: Date },
  disponibilidad: { type: Boolean, default: true }, // Para saber si está prestado
  isActive: { type: Boolean, default: true }, // Para el Soft Delete [cite: 299]
  historialReservas: [{ // Array para el historial [cite: 310]
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fechaReserva: { type: Date, default: Date.now },
    fechaEntrega: { type: Date }
  }]
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;