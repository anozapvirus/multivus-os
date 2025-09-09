const CACHE_NAME = "multivus-os-v2"
const urlsToCache = [
  "/",
  "/portal",
  "/work-orders",
  "/customers",
  "/inventory",
  "/financial",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET requests
          if (request.method === "GET" && response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request)
        }),
    )
    return
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
          return fetchResponse
        })
      )
    }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Background sync for offline operations
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Trigger sync in the main app
      self.clients
        .matchAll()
        .then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "BACKGROUND_SYNC" })
          })
        }),
    )
  }
})

// Handle push notifications
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: data.data,
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})
