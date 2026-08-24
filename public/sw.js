// Colorist PWA - Offline-First Service Worker (Resilient Subpath Support)
const CACHE_NAME = "colorist-pwa-v3";

// Install: Pre-cache relative scope base
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate: Clean up older cache versions and take immediate control
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

// Fetch: Network First with Cache Fallback for maximum reliability
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Do not intercept non-GET requests or browser extension/chrome-extension requests
  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  const url = new URL(request.url);

  // Skip dynamic backend API calls
  if (url.pathname.includes("/api/")) {
    return;
  }

  // Network-First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Only cache valid successful GET responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          }).catch(() => {});
        }
        return networkResponse;
      })
      .catch(async () => {
        // When network fails (offline), try the cache
        const cached = await caches.match(request);
        if (cached) {
          return cached;
        }

        // If it's a navigation (HTML document request) and offline, return cached root/index if available
        if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
          const rootCached = await caches.match(self.registration.scope);
          if (rootCached) return rootCached;
        }

        return new Response("Offline mode - network request failed", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      })
  );
});
