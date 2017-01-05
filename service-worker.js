self.importScripts('node_modules/idb/lib/idb.js')
let markdownDb = idb.open('mdFileHistory', 8);

function getLocalRecords() {
  return markdownDb.then(db => db.transaction('mdFiles').objectStore('mdFiles').getAll());
}

function persistLocalChanges() {
  return getLocalRecords().then(records => {
    return fetch('/markdowns', {
      method: 'POST',
      body: JSON.stringify({ 
        markdowns: records
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
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

self.addEventListener('sync', event => {
  if (event.tag == 'persistToDatabase') {
    event.waitUntil(persistLocalChanges()
      .then(() => {
        self.registration.showNotification("Markdowns synced to server");
      })
      .catch(() => {
        console.log("Error syncing markdowns to server");
      })
    );
  }
});