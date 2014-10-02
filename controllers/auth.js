'use strict';
(require('rootpath')());

var configs = require('config/configs');
var passport = configs.passport;

exports.checkLoggedIn = function(req, res, next) {
  req.user ? next() : res.redirect('/login');
}

exports.logout = function(req, res, next) {
  if (!req.user) {
    res.send(400, 'not logged in');
  } else {
    req.logout();
    res.redirect('/');
  }
}