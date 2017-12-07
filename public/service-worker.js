this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
        '/',
        '/app.js',
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
  );
});

this.addEventListener('message', (event) => {
  console.log(event.data.markdown);
});

this.addEventListener('sync', (event) => {
  if (event.tag === 'addMarkdown') {
    event.waitUntil(postPendingMarkdowns()
      .then(response => console.log(response))
      .catch(error => console.error(error))
    );
  }
});

const postPendingMarkdowns = () => {
  getPendingMarkdowns()
  .then((markdowns) => {
    let markdownPromises = markdowns.map((markdown) => {
      return fetch('/api/v1/markdowns', {
        method: 'POST',
        body: JSON.stringify(markdown),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    })

    return Promise.all(markdownPromises);
  })
  .catch(error => console.error(error))
};