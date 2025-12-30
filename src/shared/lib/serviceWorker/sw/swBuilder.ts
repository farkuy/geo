class SwBuilder {
  _swKey = "geo-cache-v1";
  _apiKey = "jsonplaceholder.typicode.com";

  async addResourcesToCache(resources: RequestInfo[]) {
    const cache = await caches.open(this._swKey);
    await cache.addAll(resources);
  }

  async putInCache(request: Request, response: Response) {
    const cache = await caches.open(this._swKey);
    await cache.put(request, response);
  }

  async networkError(
    title?: string,
    status?: number,
    headers?: HeadersInit,
  ): Promise<Response> {
    return new Response(title ?? "Network error happened 666", {
      status: status ?? 408,
      headers: headers ?? { "Content-Type": "text/plain" },
    });
  }

  // @ts-ignore
  async staticCacheOrNetwork(request: Request, event): Promise<Response> {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      fetch(request).then((res) =>
        event.waitUntil(this.putInCache(request, res.clone())),
      );
      return responseFromCache;
    }

    try {
      const responseFromNetwork = await fetch(request);
      if (responseFromNetwork) {
        event.waitUntil(this.putInCache(request, responseFromNetwork.clone()));
        return responseFromNetwork;
      }
    } catch (error) {
      return this.networkError();
    }
  }

  // @ts-ignore
  async networkWrapper(request: Request, event): Promise<Response> {
    const path = new URL(request.url);
    let response: Response;
    console.log("start wrapper");

    if (path.hostname.includes(this._apiKey)) {
      console.log("dync");
      response = await fetch(request);
    } else {
      console.log("stat");
      response = await this.staticCacheOrNetwork(request, event);
    }

    return response;
  }

  async deleteCache(key: string): Promise<void> {
    await caches.delete(key);
  }

  async deleteOldCaches(): Promise<void> {
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => key != this._swKey);
    await Promise.all(cachesToDelete.map(this.deleteCache));
  }
}

export const swBuilder = new SwBuilder();
