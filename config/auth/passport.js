'use strict';
require('rootpath')();

//OAuth strategy dependencies
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('config/settings/auth');

//load up the user model
var User = require('models/User');

function localLoginVerifyCallback(req, email, password, done) {
  process.nextTick(function() {
    User.findOne(
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
      });
  });
}

function localSignupVerifyCallback(req, email, password, done) {

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

  process.nextTick(function() {
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
    }
  });
}

function facebookVerifyCallback(req, token, refreshToken, profile, done) {

  var foundUserInDb = function(user) {
    // if there is a user id already but no token 
    // (user was linked at one point and then removed)
    // else user found, return that user
    if (!user.facebook.token) {
      user.facebook.token = token;
      user.facebook.name = profile.name.givenName+' '+profile.name.familyName;
      user.facebook.email = profile.emails[0].value;

      user.save(function(err) {
        if (err) { return done(err); }
        return done(null, user);
      });
    }
    
    return done(null, user);
  };

  var findUserCallback = function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      foundUserInDb(user);
    } else {
      // if there is no user, create them
      var newUser = new User();
      newUser.facebook.id = profile.id;
      newUser.facebook.token = token;
      newUser.facebook.name = profile.name.givenName +
              ' ' + profile.name.familyName;
      newUser.facebook.email = profile.emails[0].value;

      user.save(function(err) {
        if (err) { return done(err); }
        return done(null, user);
      });    
    }
  };

  process.nextTick(function() {
    // check if the user is already logged in
    if (!req.user) {
      User.findOne({'facebook.id': profile.id }, findUserCallback);
    } else {
      // user already exists and is logged in, we have to link accounts
      // pull the user out of the session
      var user = req.user; 

      user.facebook.id = profile.id;
      user.facebook.token = token;
      user.facebook.name = profile.name.givenName+' '+profile.name.familyName;
      user.facebook.email = profile.emails[0].value;

      user.save(function(err) {
        if (err) { done(err); }
        return done(null, user);
      });
    }
  });

}

function twitterVerifyCallback(req, token, tokenSecret, profile, done) {
  var foundUserInDb = function(user) {
    // if there is a user id already but no token 
    // (user was linked at one point and then removed)
    // else user found, return that user
    if (!user.twitter.token) {
      user.twitter.token = token;
      user.twitter.username = profile.username;
      user.twitter.displayName = profile.displayName;

      user.save(function(err) {
        if (err) { return done(err); }
        return done(null, user);
      });
    } 

    return done(null, user); // user found, return that user
  };

  var findUserCallback = function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      foundUserInDb(user);
    } else {
      // if there is no user, create them
      var newUser = new User();

      newUser.twitter.id = profile.id;
      newUser.twitter.token = token;
      newUser.twitter.username = profile.username;
      newUser.twitter.displayName = profile.displayName;

      user.save(function(err) {
        if (err) { return done(err); }
        return done(null, user);
      });    
    }
  };

  process.nextTick(function() {

    // check if the user is already logged in
    // if user already exists and is logged in, we have to link accounts
    if (!req.user) {
      User.findOne({'twitter.id': profile.id }, findUserCallback);
    } else {
      
      var user = req.user; 

      user.twitter.id = profile.id;
      user.twitter.token = token;
      user.twitter.username = profile.username;
      user.twitter.displayName = profile.displayName;

      user.save(function(err) {
        if (err) { return done(err); }
        return done(null, user);
      });
    }
  });

}

function googleVerifyCallback(req, token, refreshToken, profile, done) {
  var foundUserInDb = function(user) {
    // if there is a user id already but no token 
    // (user was linked at one point and then removed)
    // else user found, return that user
    if (!user.google.token) {
      user.google.token = token;
      user.google.name  = profile.displayName;
      user.google.email = profile.emails[0].value; // pull the first email

      user.save(function(err) {
        if (err) { return done(err); }
        return done(null, user);
      });
    }

    return done(null, user);
  };

  var findUserCallback = function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      foundUserInDb(user);
    } else {
      // if there is no user, create them
      var newUser = new User();

      newUser.google.id = profile.id;
      newUser.google.token = token;
      newUser.google.name = profile.displayName;
      // pull the first email
      newUser.google.email = profile.emails[0].value;

      user.save(function(err) {
        if (err) { return done(err); }
        return done(null, user);
      });    
    }
  };

  process.nextTick(function() {

    // check if the user is already logged in
    if (!req.user) {
      User.findOne({ 'google.id' : profile.id }, findUserCallback);
    } else {
      // user already exists and is logged in, we have to link accounts
      var user = req.user; // pull the user out of the session

      user.google.id = profile.id;
      user.google.token = token;
      user.google.name  = profile.displayName;
      user.google.email = profile.emails[0].value; // pull the first email

      user.save(function(err) {
        if (err) { return done(err); }
        return done(null, user);
      });
    }
  });  
}

module.exports = function(passport) {
  /* Passport needs ability to serialize and deserialize users out of session */

  // Serialize the user for the session
  passport.serializeUser(function(user, done) { done(null, user.id); });

  // Deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) { done(err, user); });
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

  //Facebook Strategy
  //req is first arg to callback since passReqToCallback is set to true
  passport.use(new FacebookStrategy({
    clientID : configAuth.facebookAuth.clientID,
    clientSecret : configAuth.facebookAuth.clientSecret,
    callbackURL : configAuth.facebookAuth.callbackURL,
    passReqToCallback : true
  },
  facebookVerifyCallback));

  //Twitter
  //req is first arg to callback since passReqToCallback is set to true
  //with req, it lets us check if a user is logged in or not
  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
    passReqToCallback : true 
  },
  twitterVerifyCallback));

  //Google
  //req is first arg to callback since passReqToCallback is set to true
  //with req, it lets us check if a user is logged in or not
  passport.use(new GoogleStrategy({
    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,
    passReqToCallback : true 
  },
  googleVerifyCallback));   

};       

