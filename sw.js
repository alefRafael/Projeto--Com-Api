const CACHE_NAME = "animais-pwa-v1";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./offline.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((chaves) => {
      return Promise.all(
        chaves
          .filter((chave) => chave !== CACHE_NAME)
          .map((chave) => caches.delete(chave))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./offline.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((resposta) => {
      return resposta || fetch(event.request);
    })
  );
});