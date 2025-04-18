import { precacheAndRoute } from 'workbox-precaching'

// Inject static asset
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => clients.claim())

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  const options = {
    body: data.body || '📢 คุณมีการแจ้งเตือนใหม่!',
    icon: '/creative192.png',
    badge: '/creative192.png',
    data: { url: data.url || '/' }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || '🔔 แจ้งเตือน', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) return client.focus()
      }
      return clients.openWindow?.(targetUrl)
    })
  )
})

self.addEventListener('fetch', (event) => {
  const url = event.request.url

  if (url.includes('/auth/verify')) {
    event.respondWith(
      fetch(event.request)
        .then(res => res)
        .catch(() => new Response(JSON.stringify({ user: null }), {
          headers: { 'Content-Type': 'application/json' }
        }))
    )
    return
  }

  if (url.includes('/api')) {
    event.respondWith(fetch(event.request))
    return
  }
})
