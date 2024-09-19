const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const config = {
  port: 9000,
  host: 'localhost'
};

const init = async (config) => {
  try {
    const server = Hapi.server({
      port: config.port,
      host: config.host,
      routes: {
        cors: {
          origin: ['*'] 
        }
      }
    });

    server.route(routes);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    
    return server;
  } catch (error) {
    console.error('Error starting server:', error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

init(config);