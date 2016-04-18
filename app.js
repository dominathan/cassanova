var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var env = process.env.NODE_ENV || 'development';
var configDB = require("./knexfile");
global.knex = require('knex')(configDB[env]);

var CronExecutables = require('./services/cronTasks');
var tinderInfo = require('./services/tinder-client');

var routes = require('./controllers/index');
var facebookInfo = require('./controllers/facebook-login');
var UserMatchesController = require('./controllers/userMatchesController')
var ChatController = require('./controllers/chatsController');
var authenitcation = require('./controllers/authentication');
var MatchController = require('./controllers/matchController');
var ProfileController = require("./controllers/profileController");

if(env === "production") {
  var newRelic = require('newrelic');
}

var app = express();

// view engine setup
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

/*
 * Routes for client to access
 */
app.use('/api/fake_accounts',routes);
app.use('/api/targets',MatchController);
app.use('/api/user-matches', UserMatchesController);
app.use('/api/facebook', facebookInfo);
app.use('/api/tinder', tinderInfo);
app.use('/api/chats', ChatController);
app.use('/auth', authenitcation);
app.use('/api',ProfileController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
