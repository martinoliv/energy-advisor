// Service Worker - EnergyAdvisor PWA
const CACHE_NAME = "energy-advisor-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Instalação - cache de assets estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Falha silenciosa se algum asset não existir
      });
    })
  );
  self.skipWaiting();
});

// Ativação - limpar caches antigas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch - estratégia network-first para API, cache-first para assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API calls sempre do servidor (nunca em cache)
  if (url.pathname.startsWith("/api/")) {
    return; // deixa o browser tratar normalmente
  }

  // Assets estáticos - cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            // Cacheia novos assets
            if (response.ok && event.request.method === "GET") {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => caches.match("/"))
      );
    })
  );
});
