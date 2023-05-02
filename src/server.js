const Hapi = require('@hapi/hapi')
const routes = require('./routes')

// Konfigurasi server
const config = {
  port: 9000,
  host: 'localhost'
}

// Fungsi untuk menjalankan server
const init = async (c) => {
  // Membuat instance server Hapi
  const server = Hapi.server({
    port: c.port,
    host: c.host,
    // Konfigurasi CORS
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  // Menambahkan rute dari file routes.js
  server.route(routes)

  // Menjalankan server
  await server.start()
  // Development
  console.log(`Server running on ${server.info.uri}`)

  return server
}

// Menjalankan server dengan konfigurasi yang sudah ditentukan
init(config)
