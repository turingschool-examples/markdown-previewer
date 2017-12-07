import {
  saveOfflineMarkdown,
  loadOfflineMarkdowns,
  getSingleMarkdown
} from './indexedDB';



/****EVENT LISTENERS****/

// Update HTML preview when markdown textarea changes
$('#live-markdown').on('keyup', event => updatePreview(event));

// Set selected markdown when using drop down menu
$('#offline-markdowns').on('change', function(event) {
  let markdownId = $(this).val().split('-')[1];
  setSelectedMarkdown(markdownId);
});

// Save markdown to IndexedDB
$('#submit-markdown').on('click', event => {
  let content = $('#live-markdown').val();
  let title = $('#title').val();
  let id = Date.now();

  /****************************** TO DO ******************************/
  // 1. Save the markdown to indexedDB with appropriate data. Then...
  // 2. Append markdown to the DOM with the appendMarkdowns() function
  /*******************************************************************/
});



/****HELPER FUNCTIONS****/

// Append markdowns to the drop-down menu
const appendMarkdowns = (mds) => {
  mds.forEach(md => {
    $('#offline-markdowns').append(`<option value="md-${md.id}">${md.title}</option>`);
  });
}

// Update markdown/HTML content when selecting markdown from drop-down menu
const setSelectedMarkdown = (id) => {
  /****************************** TO DO ******************************/
  // 1. Get single markdown from IDB by it's ID. Then...
  // 2. Update the value of the #live-markdown textarea to display that
  //    markdown's content
  // 3. Then, trigger keyup() on the #live-markdown textarea to prompt
  //    the HTML preview to update
  /*******************************************************************/
}

// Update the HTML preview when the markdown changes
const updatePreview = (event) => {
  const md = markdownit();
  let htmlResult = md.render(event.currentTarget.value);
  $('#html-preview').html(htmlResult);
};



/****SERVICE WORKER REGISTRATION****/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    
  /****************************** TO DO ******************************/
  // 1. Load markdowns from IndexedDB, then...
  // 2. append them to the DOM with appendMarkdowns()
  /*******************************************************************/
    
    // Register a new service worker
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        console.log(`ServiceWorker registration failed: ${err}`);
      });

  });
}
