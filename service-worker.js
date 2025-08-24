// Define um nome e versão para o cache
const CACHE_NAME = 'planner-gamificado-v2'; // Mudei para v2 para forçar a atualização

// Lista de TODOS os arquivos essenciais para o app funcionar offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Evento 'install': é disparado quando o Service Worker é instalado.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e arquivos sendo salvos');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': intercepta as requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna do cache.
        if (response) {
          return response;
        }
        // Se não, busca na rede.
        return fetch(event.request);
      })
  );
});

// Evento 'activate': limpa caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
