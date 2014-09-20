'use strict';
require('rootpath')();

var FlickrStrategy = require('passport-flickr').Strategy;
var configAuth = require('config/settings/auth');

function flickrVerifyCallback(token, tokenSecret, profile, done) {

}

module.exports = function(passport) {
  /* Passport needs ability to serialize and deserialize users out of session */

  // Serialize the user for the session
  passport.serializeUser(function(user, done) { done(null, user.id); });

  // Deserialize the user
  passport.deserializeUser(function(id, done) {
    //User.findById(id, function(err, user) { done(err, user); });
  });

  passport.use('flickr', new FlickrStrategy(configAuth, flickrVerifyCallback));
};