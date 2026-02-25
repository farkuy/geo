import { SwCache } from "@/shared/lib/cache/cache";

class SwBuilder {
  _cache: SwCache;

  constructor(cache: SwCache) {
    this._cache = cache;
  }

  async cacheFirst(request: RequestInfo | URL) {
    try {
      const inCache = await this._cache.match(request);
      if (inCache) return inCache;

      const response = await fetch(request);
      const responseClone = response.clone();
      await this._cache.put(request, responseClone);

      return response;
    } catch (e) {
      //TODO: продумать шо тут делать
      console.error("");
    }
  }

  async onlineFirst(request: RequestInfo | URL) {
    try {
      const response = await fetch(request);

      const responseClone = response.clone();
      await this._cache.put(request, responseClone);

      return response;
    } catch (e) {
      //TODO: продумать шо тут делать
      console.error("");
    }
  }

  async addResourcesToCache(resources: RequestInfo[]) {
    await this._cache.addAll(resources);
  }

  async deleteOldCacheVersion() {
    const currentKey = this._cache?.getCacheKey();
    const keyList = await caches.keys();

    const oldCache = keyList.filter((key) => key !== currentKey);
    return Promise.all(oldCache.map((key) => caches.delete(key)));
  }
}

export const cache = new SwCache("geo");
export const swBuilder = new SwBuilder(cache);
