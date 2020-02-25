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

   /**
   * Method to check if key is present in cache and return data; else make call and return data
   * @param key: string
   * @param storePromise: Promise
   * @returns data array
   */
  public get(key: string, storePromise: Promise<any>) {
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

   /**
   * Method to flush cache stored in node-cache instance
   */
  public flush(): void {
    this.cache.flushAll();
  }
}

export default Cache;
