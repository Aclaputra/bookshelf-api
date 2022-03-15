const { nanoid } = require('nanoid');
const books = require('./books');

// Kriteria 1: API Dapat Menyimpan Buku
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if (name === undefined || name === false || name <= 0) {
    // Client tidak melampirkan properti name pada request body
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (pageCount === readPage) finished = true;
  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    finished,
    readPage,
    reading,
    insertedAt,
    updatedAt,
  };
  if (readPage > pageCount) {
    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  books.push(newBooks);
  const isSuccess = books.filter((n) => n.id === id).length > 0;
  if (isSuccess) {
    // Bila buku berhasil dimasukkan
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  // jika gagal memasukkan buku karena alasan umum (generic error)
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};
// Kriteria 2: API Dapat Menampilkan Seluruh Buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (name) {
    const findBooksName = books.filter((n) => {
      const nameRegExp = new RegExp(name, 'gi');
      return nameRegExp.test(n.name);
    });

    const response = h.response({
      status: 'success',
      data: {
        books: findBooksName.map((n) => ({
          id: n.id,
          name: n.name,
          publisher: n.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (reading) {
    const findBooksName = books.filter((n) => Number(n.reading) === Number(reading));
    const response = h.response({
      status: 'success',
      data: {
        books: findBooksName.map((n) => ({
          id: n.id,
          name: n.name,
          publisher: n.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  const findBooksName = books.filter((n) => Number(n.finished) === Number(finished));
  const response = h.response({
    status: 'success',
    data: {
      books: findBooksName.map((n) => ({
        id: n.id,
        name: n.name,
        publisher: n.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};
// Kriteria 3: API Dapat Menampilkan Detail Buku
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
// Kriteria 4: API Dapat Mengubah Data Buku
const updateBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined || name === false || name <= 0) {
    // Client tidak melampirkan properti name pada request body
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((n) => n.id === id);
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
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
// Kriteria 5: API Dapat Menghapus Buku
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((n) => n.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
