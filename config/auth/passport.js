'use strict';
require('rootpath')();

var FlickrStrategy = require('passport-flickr').Strategy;
var User = require('models/User');
var configAuth = require('config/settings/auth');

function flickrVerifyCallback(token, tokenSecret, profile, done) {
  User.findById(profile.id, function(err, user) {
    if (err) { return done(err); }
    if (user) {
      done(null, user);
    } else {
      User.add(profile.id, token, tokenSecret, function(err) {
        err ? done(err) : done(null, user);
      });
    }
  });
}

module.exports = function(passport) {
  /* Passport needs ability to serialize and deserialize users out of session */

  // Serialize the user for the session
  // only store the id
  passport.serializeUser(function(user, done) { done(null, user.flickrId); });

  // Deserialize the user
  passport.deserializeUser(function(flickrId, done) {
    User.selectById(flickrId, function(err, user) { done(err, user); });
  });

  passport.use('flickr', new FlickrStrategy(
          configAuth.flickrAuth, flickrVerifyCallback));
};