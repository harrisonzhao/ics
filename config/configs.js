'use strict';
(require('rootpath')());

var bodyParser = require('body-parser');
var cookieparser = require('cookie-parser');
var compress = require('compression');
var express = require('express');
var flash = require('connect-flash');
var hbs = require('hbs');
var helmet = require('helmet');
var methodOverride = require('method-override');
var morgan = require('morgan');
var mysql = require('mysql');
var path = require('path');
var passport = require('passport');
var session = require('express-session');

var settings = require('./settings/exports');

//set up mysql connection and setup passport configuration
var connection = mysql.createConnection(settings.secrets.mysqlConfigs);
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected as id ' + connection.threadId);
  }
});
require('./passport')(passport);

//exported configurations
var config = {
  configure: function(app) {
    app.use(helmet());
    app.use(morgan('short'));

    //configure handlebars
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'hbs');
    app.engine('hbs', hbs.__express);
    app.engine('html', hbs.__express);

    app.use(express.static(path.join(__dirname, "../public")));
    app.use(compress());
    app.use(bodyParser());
    app.use(cookieparser());
    app.use(methodOverride());
    app.use(session({
      secret: settings.secrets.sessionSecret,
      key: 'sid', 
      cookie: { secure: true }
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
  },
  mysql: connection,
  passport: passport,
  settings: settings
}

module.exports = config;