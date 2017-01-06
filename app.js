const markdownDb = idb.open('mdFileHistory', 8, upgradeDB => {
  upgradeDB.createObjectStore('mdFiles', { keyPath: 'createdAt' });
});

function populateRecords() {
  let getLocalRecords = markdownDb.then(db => db.transaction('mdFiles').objectStore('mdFiles').getAll());
  getLocalRecords.then(records => {
    records.forEach(record => {
      $('#markdown-records').append(`<option value=${record.createdAt}>${record.fileName}</option>`);
    });

    $('.counter').text(records.length);
    $('#markdown-records').change(event => {
      loadMarkdown(parseInt(event.currentTarget.value));
    });
  });
}

function loadMarkdown(markdownCreatedAt) {
  markdownDb.then(db => {
    return db.transaction('mdFiles').objectStore('mdFiles').get(markdownCreatedAt);
  }).then(result => {
    const { fileName, mdContent } = result;

    $('#file-name').val(fileName)
    $('#live-markdown').val(mdContent);
    updatePreview(mdContent);
  });
};

function updatePreview(mdContent) {
  const md = markdownit();
  let htmlResult = md.render(mdContent);
  $('#html-preview').html(htmlResult);
};

function saveMarkdownLocally(values) {
  let markdownData = {
    mdContent: values.mdContent,
    authorName: 'Brittany Storoz',
    fileName: `${values.fileName}.md`,
    createdAt: Date.now()
  }

  return markdownDb.then(db => {
    const transaction = db.transaction('mdFiles', 'readwrite');
    transaction.objectStore('mdFiles').put(markdownData);

    let currentCount = parseInt($('.counter').text());
    $('.counter').text(currentCount + 1);
    $('#markdown-records').append(`<option value=${markdownData.createdAt}>${markdownData.fileName}</option>`);

    return transaction.complete;
  });
}

$('#live-markdown').on('keyup', event => updatePreview(event.currentTarget.value));
populateRecords();


if ('serviceWorker' in navigator && 'SyncManager' in window) {
 // register service worker here
}