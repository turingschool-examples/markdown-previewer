import {
  saveOfflineMarkdown,
  loadOfflineMarkdowns,
  getSingleMarkdown
} from './indexedDB';

$('#live-markdown').on('keyup', event => updatePreview(event));
$('#offline-markdowns').on('change', function(event) {
  let markdownId = $(this).val().split('-')[1];
  setSelectedMarkdown(markdownId);
});

$('#submit-markdown').on('click', event => {
  let content = $('#live-markdown').val();
  let title = $('#title').val();
  let id = Date.now();

  saveOfflineMarkdown({ id, content, title })
    .then(md => { appendMarkdowns([{ id, title }])})
    .catch(error => console.log(`Error saving markdown: ${error}`));
});

const appendMarkdowns = (mds) => {
  mds.forEach(md => {
    $('#offline-markdowns').append(`<option value="md-${md.id}">${md.title}</option>`);
  })
}

const setSelectedMarkdown = (id) => {
  console.log("ID: ", id, typeof id);
  getSingleMarkdown(id).then(md => {
    console.log("MD: ", md);
    $('#live-markdown').val(md.content);
    $('#live-markdown').keyup();
  }).catch(error => console.log({error}))
}

const updatePreview = (event) => {
  const md = markdownit();
  let htmlResult = md.render(event.currentTarget.value);
  $('#html-preview').html(htmlResult);
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    
    // Load markdowns from indexedDB
    loadOfflineMarkdowns()
      .then(markdowns => appendMarkdowns(markdowns))
      .catch(error => console.log(`Error loading markdowns: ${error}`));
    
    // Register a new service worker
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
