// Define um nome e versão para o cache
const CACHE_NAME = 'planner-gamificado-v1';

// Lista de arquivos essenciais para o app funcionar offline
// Como seu CSS e JS estão no HTML, só precisamos do próprio HTML.
const urlsToCache = [
  '/',
  'index.html'
];

// Evento 'install': é disparado quando o Service Worker é instalado.
// Usamos para baixar e salvar os arquivos no cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': é disparado para cada requisição que a página faz (imagens, scripts, etc.).
// Nós interceptamos a requisição e verificamos se já temos a resposta no cache.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrarmos a resposta no cache, a retornamos.
        if (response) {
          return response;
        }
        // Se não, fazemos a requisição à rede normalmente.
        return fetch(event.request);
      })
  );
});

// Evento 'activate': é disparado quando o Service Worker é ativado.
// Usado para limpar caches antigos se você atualizar a versão do CACHE_NAME.
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
