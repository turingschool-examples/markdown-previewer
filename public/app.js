$('#live-markdown').on('keyup', event => updatePreview(event));

function updatePreview(event) {
  const md = markdownit();
  let htmlResult = md.render(event.currentTarget.value);
  $('#html-preview').html(htmlResult);
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        // Registration was successful
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        // registration failed :(
        console.log(`ServiceWorker registration failed: ${err}`);
      });
  });
}
