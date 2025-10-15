const CACHE_NAME = "panigal-cache-v1"; // change version when you deploy new build

// List of URLs to cache during install
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/tasks-192x192.png",
  "/icons/tasks-512x512.png",
  "/static/index-aukU51WB.js", 
  "/static/index-CPEquEtr.css"
];


// Install event: cache assets
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker: Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: clear old caches
self.addEventListener("activate", (event) => {
  console.log("⚡ Service Worker: Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("Deleting old cache:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Fetch event: serve cached files if available
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version, or fetch from network if not cached
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          // Optionally cache new requests here if needed
          return fetchResponse;
        })
      );
    })
  );
});
