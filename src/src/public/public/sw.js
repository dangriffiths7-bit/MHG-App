// Simple, safe service worker:
// - Caches on first use
// - Works under GitHub Pages subpath
// - Keeps things fresh when you update

const CACHE = "app-cache-v1";
const OFFLINE_URLS = [
  "./",               // resolves to the repo subpath on GitHub Pages
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.svg",
  "icons/icon-512.svg"
];

// Install: pre-cache minimal shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_URLS))
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for GET; fall back to network; if offline, use cache
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          const resClone = res.clone();
          // Only cache successful, same-origin responses
          if (res.ok && new URL(req.url).origin === location.origin) {
            caches.open(CACHE).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached); // if offline and we have cache, use it
      return cached || fetched;
    })
  );
});
