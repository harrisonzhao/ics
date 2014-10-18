'use strict';
require('rootpath')();

var async = require('async');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('models/Users');
var testApiKey = require('lib/flickr/testApiKey');
var dbErrors = require('config/settings/dbErrors');

function localLoginVerifyCallback(email, password, done) {
  Users.selectByEmail(email, function(err, result) {
    if (err) { return done(err); }
    if (!result) { 
      return done(null, false, {
        message: 'Invalid username or password'
      }); 
    }
    if (Users.comparePassword(password, result.passwordHash)) {
      done(null, result); 
    } else {
      done(null, false, {message: 'Invalid username or password'})
    }
  });
}

//body must contain fields apiKey, apiKeySecret, firstName, and lastName
function localSignupVerifyCallback(req, email, password, done) {
  if (!(
    req.body.apiKey && 
    req.body.secret && 
    email && 
    req.body.firstName &&
    req.body.lastName &&
    password)) { return done(new Error('Missing some fields')); }
  async.waterfall(
  [
    function(callback) {
      testApiKey(req.body.apiKey, req.body.secret, function(err) {
        if (err) { callback(new Error('Invalid api key or api key secret')); }
        callback(null);
      });
    },
    function(callback) {
      Users.create(
        req.body.apiKey, 
        req.body.apiKeySecret, 
        email,
        req.body.firstName,
        req.body.lastName,
        password, 
        function(err, result) {

        if (err && err.errno === dbErrors.duplicateEntry) {
          return done(null, false, {message: 'Email already taken'});
        }
        err ? callback(err) : callback(null, result);
      });
    },
    function(idUser, callback) {
      Users.selectById(idUser, callback);
    }
  ],
  function(err, user) {
    err ? done(err) : done(null, user);
  });
}

module.exports = function(passport) {

  // Serialize the user for the session
  // only store the id
  passport.serializeUser(function(user, done) { done(null, user.idUser); });

  // Deserialize the user
  passport.deserializeUser(function(id, done) {
    Users.selectById(id, function(err, user) { done(err, user); });
  });

  // Local login strategy
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  localLoginVerifyCallback));

  // Local signup strategy
  // body must contain fields apiKey, apiKeySecret, firstName, and lastName
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  localSignupVerifyCallback));

};