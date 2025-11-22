const mongoose = require('mongoose');

// Usamos localhost si no hay variable de entorno definida
const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/biblioteca'; 

const connectDB = async () => {
  try {
    // Intentamos conectar
    await mongoose.connect(connectionString);
    console.log('Conexión a MongoDB exitosa 🟢');
  } catch (error) {
    console.error('Error conectando a MongoDB 🔴:', error);
    process.exit(1); // Detiene la app si no hay base de datos
  }
};

module.exports = connectDB;