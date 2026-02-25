/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />

import { swBuilder } from "./src/shared/lib/serviceWorker";
import { indexBd } from "./src/shared/lib/indexDb";

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(swBuilder.deleteOldCacheVersion());
});

self.addEventListener("install", async (event: ExtendableEvent) => {
  await indexBd.openBd();
  event.waitUntil(
    swBuilder.addResourcesToCache(["./index.html", "/index.html"]),
  );
});
