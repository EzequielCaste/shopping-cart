const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const session = require('express-session');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user')
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

const app = express();
//"mongodb://localhost/shop-cart"
mongoose.connect(process.env.MONGO_URL, {  useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'jwsvJIwzGiciuer6YBBk',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 5 * 60 * 1000}
}))

// app.use(function(req, res, next) {
//   app.locals.login = req.verify;
//   next();
// })

app.use(function(req, res, next) {
  app.locals.session = req.session;
  app.locals.login = Boolean(req.session.authToken);
  next();  
})

app.use('/user', userRouter)
app.use('/', indexRouter);



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
