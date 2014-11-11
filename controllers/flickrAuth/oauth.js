'use strict';
(require('rootpath')());

var OAuth= require('oauth').OAuth;
var FlickrAccounts = require('models/FlickrAccounts');
var secrets = require('config/settings/secrets');
var inetAddr = secrets.host + ':' + secrets.port;

if (process.env.MODE === 'production') {
  inetAddr = 'infcs.cloudapp.net';
}

function formOAuth(req) {
  return new OAuth(    
    'https://www.flickr.com/services/oauth/request_token',
    'https://www.flickr.com/services/oauth/access_token',
    req.user.apiKey,
    req.user.apiKeySecret,
    '1.0',
    'http://'+ inetAddr +'/auth/flickr/callback',
    'HMAC-SHA1');
}

exports.flickrCallback = function(req, res, next) {
  if(req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth_data = req.session.oauth;
    var oauth = formOAuth(req);
    oauth.getOAuthAccessToken(
      oauth_data.token,
      oauth_data.token_secret,
      oauth_data.verifier,
      function(error, oauth_access_token, oauth_access_token_secret) {
        delete req.session.oauth;
        if(error) { return next(error); }
        FlickrAccounts.create(
          oauth_access_token,
          oauth_access_token_secret,
          req.user.idUser,
          function(err) {
            err ? next(err) : res.redirect('/');
          });
      });
  }
}

exports.authenticate = function(req, res, next) {
  if(req.session.oauth) {
    delete req.session.oauth;
  }
  var oauth = formOAuth(req);
  oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret) {
    if(error) {
      next(error);
    } else {
      req.session.oauth = {
        token: oauth_token,
        token_secret: oauth_token_secret
      };
      res.send('https://www.flickr.com/services/oauth/authorize?perms=delete&oauth_token='+oauth_token);
    }
  });
}
