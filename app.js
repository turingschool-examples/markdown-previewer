$('#live-markdown').on('keyup', event => updatePreview(event.currentTarget.value));

function updatePreview(markdownContent) {
  const md = markdownit();
  let htmlResult = md.render(markdownContent);
  $('#html-preview').html(htmlResult);
};

function enableSubmitButton(event) {
  if (navigator.serviceWorker.controller) {
    $('#submit-markdown').on('click', function() {
      // post message to service worker for storing markdown in IndexedDB
    });
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        enableSubmitButton();
      }).catch(err => {
        console.log(`ServiceWorker registration failed: ${err}`);
      });
  });
}