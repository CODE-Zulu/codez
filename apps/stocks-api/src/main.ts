/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import axios from 'axios';
import CacheService from './cache.service';
import { environment } from './environments/environment'

const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance

const stocksHandler = async (request, h) => {
  try {
    let data;
    const key = `stock_${request.params.symbol}_${request.params.period}`;

    // Passing key and promise to our generic cache service
    data = await cache.get(
      key,
      axios.get(`${environment.serverBaseURL}/${request.params.symbol}/chart/${request.params.period}?token=${request.query.token}`
      )
    );

    return h.response(data).code(200);

  } catch (err) {
    console.log('err==>', err);
    throw new Error(err);
  }
};

const defaultHandler = (request, h) => {
  return {
    hello: 'world'
  };
};

const flushCacheHandler = (request, h) => {
  cache.flush()
  return 'Successfully Flushed Cache';
};

const routes = [
  {
    path: '/stockName/{symbol}/chartPeriod/{period}',
    method: 'GET',
    handler: stocksHandler
  },
  {
    path: '/flush/cache',
    method: 'GET',
    handler: flushCacheHandler
  },
  {
    method: 'GET',
    path: '/',
    handler: defaultHandler
  }
];

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes: {
      cors: true
  }
  });

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
