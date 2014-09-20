'use strict';
(require('rootpath')());

var configs = require('config/configs');
var passport = configs.passport;

exports.checkLoggedIn = function(req, res, next) {
  req.user ? next() : res.redirect('/login');
}

exports.facebookAuth = passport.authenticate('facebook', {scope: 'email'});
exports.facebookAuthCallback = passport.authenticate('facebook', { 
  successRedirect: '/profile',
  failureRedirect: '/' 
});

exports.googleAuth = passport.authenticate('google', {scope: 'profile email'});
exports.googleAuthCallback = passport.authenticate('google', { 
  successRedirect: '/profile',
  failureRedirect: '/' 
});

exports.twitterAuth = passport.authenticate('twitter', {scope: 'email' });
exports.twitterAuthCallback = passport.authenticate('twitter', { 
  successRedirect: '/profile',
  failureRedirect: '/' 
});

exports.localSignup = passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash : true
});

exports.localLogin = passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
});

exports.logout = function(req, res, next) {
  if (!req.user) {
    next('not logged in');
  } else {
    req.logout();
    res.redirect('/');
  }
}