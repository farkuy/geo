import { swBuilder } from "./src/shared/lib/serviceWorker";
import { indexBd } from "./src/shared/lib/indexDb";

self.addEventListener("activate", (event) => {
  event.waitUntil(swBuilder.deleteOldCaches());
});

self.addEventListener("install", async (event) => {
  await indexBd.openBd();
  event.waitUntil(swBuilder.addResourcesToCache([]));
});
