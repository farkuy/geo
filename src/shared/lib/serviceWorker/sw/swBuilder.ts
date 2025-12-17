class SwBuilder {
  _swKey = "builder-v1";

  async addResourcesToCache(resources: RequestInfo[]) {
    const cache = await caches.open(this._swKey);
    await cache.addAll(resources);
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
