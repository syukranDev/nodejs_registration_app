var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');
const { connectDB } = require('./mongodb/mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to initialize MongoDB:', err);
    process.exit(1); 
  }
})();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'ggwp',
    resave: false,
    saveUninitialized: true
}));

app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layout'); 

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.user = req.session.user || null;
  res.locals.error = req.session.error || null;
  console.log('Session user:', req.session.user); //notedev: see if session user is set
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;