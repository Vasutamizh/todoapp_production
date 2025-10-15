const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/tasks-192x192.png",
  "/icons/tasks-512x512.png",
  "/static/index-ePcqCna6.js", 
  "/static/index-CPEquEtr.css"
];

// Install phase
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache:", error);
      });
    })
  );
  self.skipWaiting();
});

// Activate phase
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch phase
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip Chrome extension requests
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((response) => {
      // Return cached resource if available
      if (response) {
        return response;
      }

      // Fetch from network
      return fetch(request)
        .then((networkResponse) => {
          // Only cache successful responses
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type === 'opaque'
          ) {
            return networkResponse;
          }

          // Skip caching for non-GET requests
          if (request.method !== 'GET') {
            return networkResponse;
          }

          // Skip caching for requests with query parameters (except static assets)
          if (url.search && !url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/)) {
            return networkResponse;
          }

          // Cache the response
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.error("Fetch failed for:", request.url, error);
          
          // Return a fallback response for navigation requests
          if (request.destination === 'document') {
            return caches.match('/');
          }
          
          throw error;
        });
    })
  );
});