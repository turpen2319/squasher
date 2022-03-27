var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override'); //for PUT and DELETE crud

//this lets us "process" the KEY=VALUE pairs in the .env
require('dotenv').config(); 

//these config processes depend upon key=value pairs in the .env
require('./config/database.js'); //connecting to/setting up database in this file
require('./config/passport.js'); //just need to run the code in this file...we're not exporting anything from it (same with our db config)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');
const answersRouter = require('./routes/answers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SECRET,
  resave: false, //these second two are just preventing warnings
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// keep this middleware BELOW passport middleware cause passport is giving us the req.user property
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});


app.use('/', indexRouter);
app.use('/questions', questionsRouter);
app.use('/', answersRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
