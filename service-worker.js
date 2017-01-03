self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
        '/index.html',
        '/app.js',
        '/css/app.css',
        '/lib/markdown-it.min.js'
      ])
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', event => {
  self.registration.showNotification('New Markdown Saved!');
});