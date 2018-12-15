const express = require('express');
const nunjucks = require('nunjucks');
const favicon = require('serve-favicon');
const path = require('path');
const index = require('./routes/index');

const app = express();
app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')));
app.use('/', index);

app.set('views', path.join(__dirname, 'views'));

nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app
});

module.exports = app;
