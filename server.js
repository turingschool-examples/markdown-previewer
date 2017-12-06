const express = require('express');
const httpsRedirect = require('express-https-redirect');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

app.set('port', process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/', httpsRedirect);

app.get('/', (request, response) => {
  response.sendFile('index.html');
});

app.listen(app.get('port'), () => { 
  console.log(`App running on port ${app.get('port')}`)
});

module.exports = app;
