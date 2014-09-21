'use strict';
require('rootpath')();

var LocalStrategy = require('passport-local').Strategy;
var User = require('models/User');

function localLoginVerifyCallback(req, email, password, done) {
  /*User.findOne(
    {'local.email': email}, 
    function(err, user) {
      if (err) {
        return done(err);
      }
      //no user found
      if (!user) {
        return done(null, false, { message: 'No user found.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Oops! Wrong password.' });
      } else {
        return done(null, user);
      }
    });*/
}

function localSignupVerifyCallback(req, email, password, done) {
/*
  var findUserCallback = function(err, user) {
    if (err) {
      return done(err);
    }

    // check to see if theres already a user with that email
    // else create the user
    if (user) {
      return done(null, false, {message: 'That email is already taken.'});
    } else {
      var newUser = new User();
      newUser.local.email = email;
      newUser.local.password = newUser.generateHash(password);
      newUser.save(function(err) {
        if (err) { return done(err); }
        return done(null, newUser);
      });
    }
  };

  // check if the user is already logged in
  if (!req.user) {
    User.findOne({'local.email':  email}, findUserCallback);
  } else {
    var user = req.user;
    user.local.email = email;
    user.local.password = user.generateHash(password);
    user.save(function(err) {
      if (err) { return done(err); }
      return done(null, user);
    });
  }*/
}

module.exports = function(passport) {
  /* Passport needs ability to serialize and deserialize users out of session */

  // Serialize the user for the session
  // only store the id
  passport.serializeUser(function(user, done) { done(null, user.id); });

  // Deserialize the user
  passport.deserializeUser(function(id, done) {
    User.selectById(id, function(err, user) { done(err, user); });
  });

  // Local login strategy
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  localLoginVerifyCallback));

  // Local signup strategy
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  localSignupVerifyCallback));

};