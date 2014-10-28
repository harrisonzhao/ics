'use strict';
(require('rootpath')());

var configs = require('config/configs');
var passport = configs.passport;

exports.checkLoggedIn = function(req, res, next) {
  req.user ? next() : res.sendStatus(401); //401 - unauthorized
}

exports.logout = function(req, res) {
  req.logout();
  res.send(200);
}

function authenticateCallback(req, res, next, err, user, info) {
  var error = err || info;
  if (error) { return next(error); }
  req.login(user, function(err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
}

exports.login = function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    authenticateCallback(req, res, next, err, user, info);
  })(req, res, next);
}

exports.signup = function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    authenticateCallback(req, res, next, err, user, info);
  })(req, res, next);
}

exports.getUserInfo = function(req, res) {
  res.send({
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName
  });
}

exports.setCookieAndRender = function(req, res) {
  if(req.user) {
    res.cookie('user', JSON.stringify({
      
    }));
  }
  res.render('index.html');
}