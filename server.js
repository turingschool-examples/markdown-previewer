const express = require('express');
const fs = require('fs');
const app = express();
const http = require('http').Server(app);
const cors = require('express-cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'));
app.locals.title = 'Markdown Previewer'

app.locals.markdowns = [{
  'fileName': 'lorem-ipsum.md',
  'mdContent': '# hello',
  'createdAt': 1483624646713,
  'authorName': 'Joe Schmoe'
},{
  'fileName': 'dolor-set.md',
  'mdContent': '# amet',
  'createdAt': 1483624646716,
  'authorName': 'Bob Loblaw'
}];


app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});


app.post('/markdowns', (request, response) => {
  const { markdowns } = request.body;
  console.log("BODY: " , request.body);
  app.locals.markdowns = markdowns;
  response.status(201).send({markdowns: app.locals.markdowns });
})

app.get('/markdowns', function(request, response) {
  response.send({ markdowns: app.locals.markdowns });
});

let port_number = process.env.PORT || 3076

app.listen(port_number, () => {
  console.log(`${app.locals.title} is running on ${port_number}.`);
});

module.exports = app