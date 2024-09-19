const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  };

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  books.push(newBook);

  const isSuccess = books.some(book => book.id === id);

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (books.length === 0) {
    return h.response({
      status: 'success',
      data: {
        books: []
      }
    }).code(200);
  }

  let filterBook = books;

  if (name) {
    filterBook = books.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading) {
    filterBook = books.filter(book => Number(book.reading) === Number(reading));
  }

  if (finished) {
    filterBook = books.filter(book => Number(book.finished) === Number(finished));
  }

  const listBook = filterBook.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }));

  return h.response({
    status: 'success',
    data: {
      books: listBook
    }
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find(book => book.id === bookId);

  if (book) {
    return h.response({
      status: 'success',
      data: {
        book
      }
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex(book => book.id === bookId);

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex(book => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};
