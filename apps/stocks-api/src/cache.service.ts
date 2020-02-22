import * as NodeCache from 'node-cache';

class Cache {
  cache: NodeCache;

  constructor(ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });
  }

  get(key, storePromise) {
    const value = this.cache.get(key);
    if (value) {
      return Promise.resolve(value);
    }

    return storePromise.then(result => {
      if (result) {
        this.cache.set(key, result.data);
        return result.data;
      }
    });
  }

  flush() {
    this.cache.flushAll();
  }
}

export default Cache;
