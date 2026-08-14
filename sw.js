// Service worker mínimo — necessário para o navegador considerar o site "instalável".
// Não faz cache agressivo, só garante que o app funcione offline no básico.

const CACHE_NAME = "joao-layla-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Só mexe em requisições GET http(s). Uploads (POST pro Cloudinary),
  // escrita no Firestore, extensões do Chrome etc. passam direto, sem
  // tentar cachear — o Cache API só aceita GET e não aceita esquemas
  // como "chrome-extension:", por isso os erros no console.
  if (req.method !== "GET" || !req.url.startsWith("http")) {
    return;
  }

  // Estratégia network-first simples: tenta rede, cai pro cache se offline.
  event.respondWith(
    fetch(req)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(req, clone))
          .catch(() => {});
        return response;
      })
      .catch(() => caches.match(req))
  );
});
