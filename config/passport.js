'use strict';
require('rootpath')();

var async = require('async');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('models/Users');

function localLoginVerifyCallback(email, password, done) {
  Users.selectByEmail(email, function(err, result) {
    if (err) { return done(err); }
    if (!result) { return done(null, false); }
    Users.validPassword(password, result.passwordHash) ? 
            done(null, result) : done(null, false);
  });
}

function localSignupVerifyCallback(email, password, done) {
  async.waterfall(
  [
    function(callback) {
      Users.selectByEmail(email, function(err, result) {
        if (err) { return done(err); }
        if (result) { return done(null, false); }
        callback(null);
      });
    },
    function(callback) {
      Users.create(email, password, callback);
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
  /* Passport needs ability to serialize and deserialize users out of session */

  // Serialize the user for the session
  // only store the id
  passport.serializeUser(function(user, done) { done(null, user.id); });

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
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  localSignupVerifyCallback));

};