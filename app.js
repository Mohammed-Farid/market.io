const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const hbs = require('hbs');
const logger = require('morgan');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

require('dotenv').config();
require('./db/mongoose');

const partialsPath = path.join(__dirname, 'views', 'partials');
hbs.registerPartials(partialsPath);
hbs.registerHelper('json', function(obj) {
  return JSON.stringify(obj, undefined, 2);
});
const { connectRoutes } = require('./routes/routes');

const DEFAULT_PATH = path.join(__dirname, 'public');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: DEFAULT_PATH,
    dest: DEFAULT_PATH,
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(DEFAULT_PATH));
app.use(express.static(path.join(__dirname, 'build')));

app.use(connectRoutes());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
