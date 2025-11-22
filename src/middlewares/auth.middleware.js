const jwt = require('jsonwebtoken');

// Este es el "Portero". Intercepta la petición antes de que llegue al controlador.
const authMiddleware = (req, res, next) => {
  try {
    // 1. Buscamos el token en el Encabezado (Header) "Authorization"
    // El formato esperado es: "Bearer <token>" [cite: 954]
    const authHeader = req.headers['authorization'];
    
    // Si no hay header, o no tiene el formato correcto, lo rechazamos
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: "Acceso denegado: No se proporcionó un token" });
    }

    // 2. Verificamos si la firma es válida usando tu SECRETO del .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Si es válido, guardamos los datos del usuario en la petición (req)
    // Así, el controlador sabrá quién es el que está haciendo la petición
    req.user = decoded;
    
    // 4. Dejamos pasar a la siguiente función (el controlador)
    next();

  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;