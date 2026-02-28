/// <reference lib="webworker" />

import { swStrategy } from "./src/shared/lib/serviceWorker";
import { indexBd } from "./src/shared/lib/indexDb";
import { isStaticAsset } from "./src/shared/lib/cache/helpers";

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(swStrategy.deleteOldCacheVersion());
});

self.addEventListener("install", async (event: ExtendableEvent) => {
  await indexBd.openBd();
});

//TODO: Более подробно подумать над кейсами использования разных стратегий
self.addEventListener("fetch", (event: FetchEvent) => {
  if (!navigator.onLine) {
    event.respondWith(swStrategy.cacheOnly(event.request));
    return;
  }

  if (isStaticAsset(event.request.url)) {
    event.respondWith(swStrategy.cacheFirst(event.request));
  } else {
    event.respondWith(swStrategy.onlineFirst(event.request));
  }
});
