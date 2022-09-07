/* eslint-disable */
const express = require('express');
const path = require('path');
const pug = require('pug');
/* eslint-enable */
const app = express();
const PORT = 3000;

pug.basedir = path.join(__dirname, './');
app.locals.basedir = path.join(__dirname, './');
app.set('views', path.join(__dirname, './dist'));
app.set('basedir', path.join(__dirname, './dist'));
app.locals.basedir = app.get('views');
app.set('view engine', 'pug');
app.use(express.static('./dist/'));
app.use('/upload', express.static('static'));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
