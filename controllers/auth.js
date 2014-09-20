'use strict';
(require('rootpath')());

var configs = require('config/configs');
var passport = configs.passport;

exports.checkLoggedIn = function(req, res, next) {
  req.user ? next() : res.redirect('/login');
}

exports.flickrAuth = passport.authenticate('flickr');
exports.flickrAuthCallback = passport.authenticate('flickr', { 
  successRedirect: '/profile',
  failureRedirect: '/' 
});

exports.logout = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login')
  } else {
    req.logout();
    res.redirect('/');
  }
}