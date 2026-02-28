export class SwCache {
  private readonly _key: string;

  constructor(cacheKey: string) {
    this._key = cacheKey;
  }

  async addAll(requests: RequestInfo[]) {
    const cache = await caches.open(this._key);
    return await cache.addAll(requests);
  }

  async put(request: RequestInfo | URL, response: Response) {
    const cache = await caches.open(this._key);
    return await cache.put(request, response);
  }

  async match(request: RequestInfo | URL, options?: CacheQueryOptions) {
    const cache = await caches.open(this._key);
    return await cache.match(request, options);
  }

  async delete(
    request: RequestInfo | URL,
    options?: CacheQueryOptions,
  ): Promise<boolean> {
    const cache = await caches.open(this._key);
    return await cache.delete(request, options);
  }

  getCacheKey() {
    return this._key;
  }
}

export const cache = new SwCache("geo");
