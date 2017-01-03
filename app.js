// IndexedDB Variable
const DB_NAME = 'mdFileHistory';
const DB_VERSION = 4;
const DB_STORE_NAME = 'mdFiles';

let db;

// Set up our IndexedDB Database
function setupIndexedDB() {
  let req = indexedDB.open(DB_NAME, DB_VERSION);

  req.onsuccess = function(event) {
    console.log("IndexedDB opened successfully");
    db = this.result;
    logDbRecords();
  };

  req.onerror = function(event) {
    console.error("DB could not open: ", event);
  };

  req.onupgradeneeded = function(event) {
    let dataB = event.target.result;

    if (dataB.objectStoreNames.contains(DB_STORE_NAME)) {
      dataB.deleteObjectStore(DB_STORE_NAME);
    }

    let store = dataB.createObjectStore(
      DB_STORE_NAME, { keyPath: 'id', autoIncrement: true }
    );

    store.createIndex('authorName', 'authorName', { unique: false });
    store.createIndex('fileName', 'fileName', { unique: true });
    store.createIndex('markdownContent', 'markdownContent', { unique: false });
  };
};

// Cycle through IndexedDB Records and log values to the console
function logDbRecords() {
  let objectStore = db.transaction(DB_STORE_NAME, 'readwrite').objectStore(DB_STORE_NAME);
  let fileNameIndex = objectStore.index('fileName');
  let mdFilesCount = fileNameIndex.count();
  objectStore.openCursor().onsuccess = (event) => {
    let cursor = event.target.result;
    if (cursor) {
      console.log(`IndexedDB Record: ${cursor.value.fileName} by ${cursor.value.authorName}`);
      cursor.continue();
    } else {
      // When we've iterated through all the records, display the # of records in span.counter
      $('.counter').text(mdFilesCount.result);
    }
  }
}




$('#live-markdown').on('keyup', event => updatePreview(event));

function updatePreview(event) {
  const md = markdownit();
  let htmlResult = md.render(event.currentTarget.value);
  $('#html-preview').html(htmlResult);
};

function enableSubmitButton(event) {
  if (navigator.serviceWorker.controller) {
    $('#submit-markdown').on('click', function() {
      navigator.serviceWorker.controller.postMessage({
        mdContent: $('#live-markdown').val()
      });
    });
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        Notification.requestPermission();
        enableSubmitButton();
      }).catch(err => {
        // registration failed :(
        console.log(`ServiceWorker registration failed: ${err}`);
      });
  });
}

setupIndexedDB();
