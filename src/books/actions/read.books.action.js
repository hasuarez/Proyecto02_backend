const Book = require('../book.model');

async function readBooksAction({ filtro, page, limit }) {
  // 1. Construir el filtro dinámico
  const query = { isActive: true }; // Siempre excluimos los borrados

  // --- Filtros de Texto (Búsqueda flexible con Regex) ---
  if (filtro.genero) {
    query.genero = { $regex: filtro.genero, $options: 'i' };
  }
  if (filtro.autor) {
    query.autor = { $regex: filtro.autor, $options: 'i' };
  }
  if (filtro.titulo) { // Este cubre el requisito de filtrar por "nombre"
    query.titulo = { $regex: filtro.titulo, $options: 'i' };
  }
  
  // NUEVO: Filtro por Casa Editorial
  if (filtro.casaEditorial) {
    query.casaEditorial = { $regex: filtro.casaEditorial, $options: 'i' };
  }

  // --- Filtros Exactos ---
  
  // NUEVO: Filtro por Fecha de Publicación
  if (filtro.fechaPublicacion) {
    // Nota: La fecha debe enviarse exactamente igual a como se guardó (YYYY-MM-DD)
    query.fechaPublicacion = filtro.fechaPublicacion;
  }

  // Filtro por Disponibilidad (true/false)
  if (filtro.disponibilidad !== undefined) {
    query.disponibilidad = filtro.disponibilidad;
  }

  // 2. Calcular Paginación
  const paginaActual = parseInt(page) || 1;
  const librosPorPagina = parseInt(limit) || 10;
  const skip = (paginaActual - 1) * librosPorPagina;

  // 3. Ejecutar la búsqueda
  const libros = await Book.find(query)
    .select('titulo') // CUMPLE REQUISITO: "Tener unicamente el nombre de los libros"
    .skip(skip)
    .limit(librosPorPagina);

  // 4. Contar el total (usando el mismo filtro)
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