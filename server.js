const express = require('express'),
    path = require('path'),
    pug = require('pug');

const app = express(),
    PORT = 4000;

pug.basedir = path.join(__dirname, './');
app.locals.basedir = path.join(__dirname, './');

app.set('views', path.join(__dirname, './dist'))
app.set('basedir', path.join(__dirname, './dist'))
// app.locals.basedir = app.get('views');
app.set('view engine', 'pug')

app.use(express.static('./'));

// app.get('/error-5xx', (req, res) => {
//     res.render('error-5xx/error-5xx', { title: 'error-5xx', text: 'Hello there!' })
// })

app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
});