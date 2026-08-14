// Service worker mínimo — necessário para o navegador considerar o site "instalável".
// Não faz cache agressivo, só garante que o app funcione offline no básico.

const CACHE_NAME = "joao-layla-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Estratégia network-first simples: tenta rede, cai pro cache se offline.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
