$('#live-markdown').on('keyup', event => updatePreview(event));

function updatePreview(event) {
  const md = markdownit();
  let htmlResult = md.render(event.currentTarget.value);
  $('#html-preview').html(htmlResult);
};
