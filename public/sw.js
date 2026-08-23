// Colorist PWA - Offline-First Service Worker
const CACHE_NAME = "colorist-pwa-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon.svg"
];

// Install: Cache core application shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate for app assets, Network-First with Rule Fallback for API
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For API endpoints, rely on network with offline fallback
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Stale-While-Revalidate for static resources
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is HTML document, return cached root
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/index.html");
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
