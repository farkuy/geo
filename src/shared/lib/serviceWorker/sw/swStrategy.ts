/// <reference lib="webworker" />

import { cache, SwCache } from "@/shared/lib/cache/cache";

class SwStrategy {
  private readonly _cache: SwCache;

  constructor(cache: SwCache) {
    this._cache = cache;
  }

  async cacheOnly(request: RequestInfo | URL) {
    try {
      return await this._cache.match(request);
    } catch (e) {
      console.error(e);
    }
  }

  async cacheFirst(request: RequestInfo | URL) {
    try {
      const cachedResponse = await this._cache.match(request);
      if (cachedResponse) {
        fetch(request).then((response) => {
          this._cache.put(request, response.clone());
        });

        return cachedResponse;
      }

      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await this._cache.put(request, networkResponse.clone());
      }

      return networkResponse;
    } catch (e) {
      console.error(e);
    }
  }

  async onlineFirst(request: RequestInfo | URL) {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await this._cache.put(request, networkResponse.clone());
      }

      return networkResponse;
    } catch (e) {
      console.warn("Ошибка при запросе:", e);

      try {
        const cachedResponse = await this._cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
      } catch (e) {
        console.error(e);
      }
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

export const swStrategy = new SwStrategy(cache);
