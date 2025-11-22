const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/mongoose'); // Tu archivo de conexión
const userRoutes = require('./users/user.route'); // Importamos las rutas de usuario
const bookRoutes = require('./books/book.route');

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Vital para que Express entienda JSON en el body

// Rutas
// Aquí decimos: "Todo lo que empiece por /users, manéjalo con userRoutes"
app.use('/users', userRoutes);

app.use('/books', bookRoutes);

// Iniciar servidor (solo si conecta a la BD primero)
const startServer = async () => {
    await connectDB(); // Conectamos a Mongo
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
};

startServer();