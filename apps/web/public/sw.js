const CACHE_NAME = "muslim-hebat-v8";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(() => {
      // Ignore failed precache — app still works online
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET, non-http(s), API calls, and extension requests
  if (request.method !== "GET") return;
  if (request.url.includes("/api/")) return;
  if (!request.url.startsWith("http://") && !request.url.startsWith("https://")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful static responses
        if (response.ok && (request.destination === "document" || request.destination === "style" || request.destination === "script" || request.destination === "image")) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Fallback for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/");
          }
          throw new Error("Network error and no cache available");
        });
      })
  );
});
