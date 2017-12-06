const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const requireHTTPS = (request, response, next) => {
  if (request.header('x-forwarded-proto') != 'https') {
    return response.redirect(`https://${request.header('host')}${request.url}`);
  }
  next();
};

if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.locals.markdowns = [
  { id: 1512598678712, title: Lorem, content: '# hey \n## whats up' },
  { id: 1512598678716, title: Ipsum, content: '# bye \n## go away' },
  { id: 1512598678719, title: Dolor, content: '# yoo \n## set amet' }
];

app.get('/', (request, response) => {
  response.sendFile('index.html');
});

app.get('/api/v1/markdowns', (request, response) => {
  response.status(200).json(app.locals.markdowns);
});

app.post('/api/v1/markdowns', (request, response) => {
  app.locals.markdowns.push(request.body);
  response.status(201).json(app.locals.markdowns);
});

app.listen(app.get('port'), () => { 
  console.log(`App running on port ${app.get('port')}`)
});

module.exports = app;
