const Book = require('../book.model');

async function readBooksAction({ filtro, page, limit }) {
  const query = {}; // Empezamos con el query vacío

  // --- LÓGICA DE EXCLUSIÓN (Corregida) ---
  // Solo aplicamos el filtro "isActive: true" si NO nos pidieron incluir los borrados.
  if (filtro.includeDeleted !== 'true') {
    query.isActive = true;
  }
  // Si filtro.includeDeleted === 'true', entonces query.isActive no se define,
  // y Mongo traerá tanto los activos (true) como los inactivos (false).

  // --- Resto de filtros (Igual que antes) ---
  if (filtro.genero) {
    query.genero = { $regex: filtro.genero, $options: 'i' };
  }
  if (filtro.autor) {
    query.autor = { $regex: filtro.autor, $options: 'i' };
  }
  if (filtro.titulo) {
    query.titulo = { $regex: filtro.titulo, $options: 'i' };
  }
  if (filtro.casaEditorial) {
    query.casaEditorial = { $regex: filtro.casaEditorial, $options: 'i' };
  }
  if (filtro.fechaPublicacion) {
    query.fechaPublicacion = filtro.fechaPublicacion;
  }
  // Permitimos filtrar explícitamente por disponibilidad si se requiere
  if (filtro.disponibilidad !== undefined) {
    query.disponibilidad = filtro.disponibilidad;
  }

  // --- Paginación y Ejecución (Igual que antes) ---
  const paginaActual = parseInt(page) || 1;
  const librosPorPagina = parseInt(limit) || 10;
  const skip = (paginaActual - 1) * librosPorPagina;

  const libros = await Book.find(query)
    .select('titulo isActive') // Agregamos isActive para ver si funcionó el filtro
    .skip(skip)
    .limit(librosPorPagina);

  const totalLibros = await Book.countDocuments(query);

  return {
    resultados: libros,
    paginacion: {
      paginaActual,
      librosPorPagina,
      totalLibros,
      totalPaginas: Math.ceil(totalLibros / librosPorPagina)
    }
  };
}

module.exports = readBooksAction;