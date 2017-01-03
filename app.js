function loadMarkdown(markdownFileId) {
  let objectStore = db.transaction(DB_STORE_NAME, 'readwrite').objectStore(DB_STORE_NAME);
  let request = objectStore.get(markdownFileId);

  request.onerror = function(event) {
    console.log('Request Error');
  };

  request.onsuccess = function(event) {
    let mdResult = request.result.markdownContent;
    let mdFileName = request.result.fileName;

    $('#file-name').val(mdFileName)
    $('#live-markdown').val(mdResult);
    updatePreview(mdResult);
  };
}

$('#live-markdown').on('keyup', event => updatePreview(event.currentTarget.value));

function updatePreview(markdownContent) {
  const md = markdownit();
  let htmlResult = md.render(markdownContent);
  $('#html-preview').html(htmlResult);
};

function enableSubmitButton(event) {
  if (navigator.serviceWorker.controller) {
    $('#submit-markdown').on('click', function() {
      navigator.serviceWorker.controller.postMessage({
        mdFileName: $('#file-name').val(),
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
        console.log(`ServiceWorker registration failed: ${err}`);
      });
  });
}