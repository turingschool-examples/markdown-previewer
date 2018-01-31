this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
        '/',
        '/app.js',
        '/bundle.js',
        '/css/app.css',
        '/img/logo.png',
        '/lib/jquery-3.2.1.js',
        '/lib/markdown-it.min.js'
      ])
    })
  );
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

this.addEventListener('activate', (event) => {
  let cacheWhitelist = ['assets-v1'];

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
    .then(() => clients.claim())
  );
});

let pendingMarkdowns = [];

this.addEventListener('message', (event) => {
  if (event.data.type === 'add-markdown') {
    pendingMarkdowns.push(event.data.markdown);
    self.registration.sync.register('addMarkdown')
  }
});

this.addEventListener('sync', (event) => {
  if (event.tag === 'addMarkdown') {
    event.waitUntil(postPendingMarkdowns()
      .then(responses => {
        self.clients.matchAll().then(clients => {
          clients[0].postMessage({ type: 'markdowns-synced' });
        });
        self.registration.showNotification("New markdowns synced!");
      })
      .catch(error => console.error(error))
    );
  }
});

const postPendingMarkdowns = () => {
  let markdownPromises = pendingMarkdowns.map((markdown) => {
    return fetch('/api/v1/markdowns', {
      method: 'POST',
      body: JSON.stringify(markdown),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  return Promise.all(markdownPromises);
};