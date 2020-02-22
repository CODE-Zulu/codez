/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import axios from 'axios';
import CacheService from './cache.service';

const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance


const stocksHandler = async (request, h) => {
  let data;

  // const key = `stock_${request.params.symbol}_${request.params.period}`;

  // const cachedValue = cache.get(key)

  // if(cachedValue) {
  //    return cachedValue;
  // }

  try {

    await axios
      .get(
        `https://sandbox.iexapis.com/beta/stock/${
          request.params.symbol
        }/chart/${request.params.period}?token=${request.query.token}`
      )
      .then(resp => {
        data = resp && resp.data;
      })
      .catch(err => console.log('error=>', err));

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

const routes = [
  {
    path: '/stock/{symbol}/chart/{period}',
    method: 'GET',
    handler: stocksHandler
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
    host: 'localhost'
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
