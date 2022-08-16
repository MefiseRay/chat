const express = require('express'),
    path = require('path'),
    pug = require('pug');

const app = express(),
    PORT = 4000;

pug.basedir = path.join(__dirname, './');
app.locals.basedir = path.join(__dirname, './');
app.set('views', path.join(__dirname, './dist'))
app.set('basedir', path.join(__dirname, './dist'))
app.locals.basedir = app.get('views');
app.set('view engine', 'pug')
app.use(express.static('./dist/'));
app.use('/upload', express.static('static'));

// app.get('/error-5xx', (req, res) => {
//     res.render('error-5xx/error-5xx', { title: 'error-5xx', text: 'Hello there!' })
// })

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './dist/index.html'));
});

app.get('/authorization', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './dist/authorization/authorization.html'));
});
app.get('/registration', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './dist/registration/registration.html'));
});
app.get('/chat', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './dist/chat/chat.html'));
});
app.get('/chats', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './dist/chats/chats.html'));
});
app.get('/profile', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './dist/profile/profile.html'));
});
app.get('/error-404', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, './dist/error-404/error-404.html'));
});
app.get('/error-500', (req, res) => {
    res.status(500).sendFile(path.join(__dirname, './dist/error-500/error-500.html'));
});
app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, './dist/error-404/error-404.html'));
});

app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
});