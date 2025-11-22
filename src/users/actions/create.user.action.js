const bcrypt = require('bcrypt'); // Librería para encriptar
const User = require('../user.model'); // Importamos tu modelo

async function createUserAction(userData) {
  try {
    // 1. Validar si el usuario ya existe (por email)
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('El email ya está en uso');
    }

    // 2. Encriptar la contraseña (Hashing)
    // "10" es el número de rondas de "salt", entre más alto, más seguro pero más lento.
    // El PDF recomienda usar hashing para seguridad[cite: 126, 149].
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. Crear el usuario con la contraseña encriptada
    // Reemplazamos la contraseña original con la hash
    const newUser = await User.create({
      ...userData,
      password: hashedPassword 
    });

    // 4. Retornar el usuario creado (pero OJO, mejor no devolver la password)
    return newUser;
    
  } catch (error) {
    throw error; // Lanzamos el error para que lo maneje el controlador después
  }
}

module.exports = createUserAction;