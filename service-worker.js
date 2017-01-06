self.importScripts('node_modules/idb/lib/idb.js')
let markdownDb = idb.open('mdFileHistory', 8);

// Returns any markdown records saved in IndexedDB
function getLocalRecords() {
  return markdownDb.then(db => db.transaction('mdFiles').objectStore('mdFiles').getAll());
}

function persistLocalChanges() {
  // perform a fetch request to POST local markdowns to the server
};

self.addEventListener('install', event => {
  self.skipWaiting();
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