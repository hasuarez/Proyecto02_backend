// 1. Importar el controlador
const {
  createBookController,
  readBooksController,
  readBookDetailsController,
  updateBookController,
  deleteBookController,
  reserveBookController,
  returnBookController
} = require('./book.controller');

// 2. Importar las acciones (para mockearlas)
const createBookAction = require('./actions/create.book.action');
const readBooksAction = require('./actions/read.books.action');
const readBookDetailsAction = require('./actions/read.book.details.action');
const updateBookAction = require('./actions/update.book.action');
const deleteBookAction = require('./actions/delete.book.action');
const reserveBookAction = require('./actions/reserve.book.action');
const returnBookAction = require('./actions/return.book.action');

// 3. Mockear las acciones
jest.mock('./actions/create.book.action');
jest.mock('./actions/read.books.action');
jest.mock('./actions/read.book.details.action');
jest.mock('./actions/update.book.action');
jest.mock('./actions/delete.book.action');
jest.mock('./actions/reserve.book.action');
jest.mock('./actions/return.book.action');

describe('Book Controller', () => {

  // --- 1. CREATE ---
  describe('createBookController', () => {
    it('Debe crear libro si tiene permisos', async () => {
      const bookData = { titulo: 'Libro Test' };
      const user = { permisos: { crearLibros: true } }; // Usuario con permiso
      const mockBook = { _id: '1', ...bookData };

      createBookAction.mockResolvedValue(mockBook);

      const result = await createBookController(bookData, user);
      expect(result).toEqual(mockBook);
    });

    it('Debe fallar si NO tiene permisos', async () => {
      const user = { permisos: { crearLibros: false } }; // Usuario SIN permiso
      await expect(createBookController({}, user)).rejects.toThrow('No tienes permisos');
    });
  });

  // --- 2. READ (Listar) ---
  describe('readBooksController', () => {
    it('Debe retornar lista de libros paginada', async () => {
      const query = { page: 1, titulo: 'Test' };
      const mockResponse = { resultados: [], paginacion: {} };
      
      readBooksAction.mockResolvedValue(mockResponse);
      
      const result = await readBooksController(query);
      expect(result).toEqual(mockResponse);
    });
  });

  // --- 3. READ (Detalle) ---
  describe('readBookDetailsController', () => {
    it('Debe retornar el detalle de un libro', async () => {
      const mockBook = { _id: '1', titulo: 'Detalle' };
      readBookDetailsAction.mockResolvedValue(mockBook);
      
      const result = await readBookDetailsController('1');
      expect(result).toEqual(mockBook);
    });
  });

  // --- 4. UPDATE ---
  describe('updateBookController', () => {
    it('Debe actualizar si tiene permisos', async () => {
      const user = { permisos: { modificarLibros: true } };
      const mockBook = { _id: '1', titulo: 'Editado' };
      
      updateBookAction.mockResolvedValue(mockBook);
      
      const result = await updateBookController('1', {}, user);
      expect(result).toEqual(mockBook);
    });

    it('Debe fallar si NO tiene permisos', async () => {
      const user = { permisos: { modificarLibros: false } };
      await expect(updateBookController('1', {}, user)).rejects.toThrow('No tienes permisos');
    });
  });

  // --- 5. DELETE (Soft Delete) ---
  describe('deleteBookController', () => {
    it('Debe inhabilitar libro si tiene permisos', async () => {
      const user = { permisos: { inhabilitarLibros: true } };
      const mockBook = { _id: '1', isActive: false };
      
      deleteBookAction.mockResolvedValue(mockBook);
      
      const result = await deleteBookController('1', user);
      expect(result).toEqual(mockBook);
    });

    it('Debe fallar si NO tiene permisos', async () => {
      const user = { permisos: { inhabilitarLibros: false } };
      await expect(deleteBookController('1', user)).rejects.toThrow('No tienes permisos');
    });
  });

  // --- 6. RESERVAR ---
  describe('reserveBookController', () => {
    it('Debe reservar el libro exitosamente', async () => {
      const mockBook = { _id: '1', disponibilidad: false };
      reserveBookAction.mockResolvedValue(mockBook);

      const result = await reserveBookController('1', 'userId');
      expect(result).toEqual(mockBook);
    });
  });

  // --- 7. DEVOLVER ---
  describe('returnBookController', () => {
    it('Debe devolver el libro exitosamente', async () => {
      const mockBook = { _id: '1', disponibilidad: true };
      returnBookAction.mockResolvedValue(mockBook);

      const result = await returnBookController('1');
      expect(result).toEqual(mockBook);
    });
  });

});