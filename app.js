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
