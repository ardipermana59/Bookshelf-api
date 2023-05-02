const { nanoid } = require('nanoid')
const books = require('./books')

// Fungsi untuk menambahkan buku
const addBookHandler = (request, h) => {
  // Mendapatkan data buku dari payload
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload

  // Membuat ID untuk buku menggunakan nanoid
  const id = nanoid(16)

  // Mengecek apakah buku sudah selesai dibaca atau belum
  const finished = pageCount === readPage

  // Mendapatkan waktu saat buku ditambahkan
  const insertedAt = new Date().toISOString()

  // Mengupdate waktu terakhir kali buku diubah
  const updatedAt = insertedAt

  // Membuat objek baru yang berisi informasi buku
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
  }

  // Mengecek apakah nama buku sudah diisi
  if (typeof name === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  }

  // Mengecek apakah nilai readPage tidak lebih besar dari nilai pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  // Menambahkan buku ke dalam array books
  books.push(newBook)

  // Mengecek apakah buku berhasil ditambahkan
  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })

    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })

  response.code(500)
  return response
}

// Fungsi untuk mendapatkan semua buku atau buku sesuai filter
const getAllBooksHandler = (request, h) => {
  // Mendapatkan query dari request
  const { name, reading, finished } = request.query

  // Mengecek apakah belum ada buku yang ditambahkan
  if (books.length === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: []
      }
    })

    response.code(200)
    return response
  }

  // Membuat variabel filterBook dengan nilai awal books
  let filterBook = books

  // Jika query name tidak kosong, maka melakukan filter berdasarkan nama buku
  if (typeof name !== 'undefined') {
    filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  // Jika query reading tidak kosong, maka melakukan filter berdasarkan status membaca
  if (typeof reading !== 'undefined') {
    filterBook = books.filter((book) => Number(book.reading) === Number(reading))
  }

  // Jika query finished tidak kosong, maka melakukan filter berdasarkan status sudah membaca
  if (typeof finished !== 'undefined') {
    filterBook = books.filter((book) => Number(book.finished) === Number(finished))
  }

  const listBook = filterBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  const response = h.response({
    status: 'success',
    data: {
      books: listBook
    }
  })

  response.code(200)
  return response
}

// Handler untuk mendapatkan buku berdasarkan id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  // Cari buku di dalam array books dengan id yang sesuai
  const book = books.find((n) => n.id === bookId)

  // Jika buku ditemukan, kembalikan respons dengan status success dan data buku yang ditemukan
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })

    response.code(200)
    return response
  }

  // Jika buku tidak ditemukan, kembalikan respons dengan status fail dan pesan "Buku tidak ditemukan"
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })

  response.code(404)
  return response
}

// Fungsi untuk mengubah data buku berdasarkan ID
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  // Mendapatkan data buku berdasarkan ID
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload

  // Menyimpan waktu terbaru dari pengubahan data buku
  const updatedAt = new Date().toISOString()

  // Mencari index dari buku yang akan diubah
  const index = books.findIndex((book) => book.id === bookId)

  // Validasi apabila user tidak memasukkan nama buku
  if (typeof name === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  }

  // Validasi apabila jumlah halaman yang sudah dibaca melebihi jumlah halaman buku
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  // Mengubah data buku apabila buku ditemukan
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
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })

    response.code(200)
    return response
  }

  // Memberikan response apabila ID buku yang akan diubah tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

// Fungsi untuk menghapus buku berdasarkan id
const deleteBookByIdHandler = (request, h) => {
  // Mendapatkan id buku dari parameter request
  const { bookId } = request.params

  // Mencari index buku yang akan dihapus
  const index = books.findIndex((book) => book.id === bookId)

  // Jika index ditemukan (buku ada dalam array books)
  if (index !== -1) {
    // Menghapus buku dari array books
    books.splice(index, 1)

    // Mengembalikan response berhasil
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })

    // Set status code 200
    response.code(200)
    return response
  }

  // Jika index tidak ditemukan (buku tidak ada dalam array books)
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })

  // Set status code 404
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
