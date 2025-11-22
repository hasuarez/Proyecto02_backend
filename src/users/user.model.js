const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permisos: {
    crearLibros: { type: Boolean, default: false },
    modificarLibros: { type: Boolean, default: false },
    inhabilitarLibros: { type: Boolean, default: false },
    modificarUsuarios: { type: Boolean, default: false },
    inhabilitarUsuarios: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  // --- NUEVO: Requisito de Historial en el Usuario  ---
  historialReservas: [{
    libroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    tituloLibro: String, // Guardamos el título por si borran el libro
    fechaReserva: { type: Date, default: Date.now },
    fechaEntrega: { type: Date }
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;