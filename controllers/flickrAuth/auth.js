'use strict';
(require('rootpath')());

var async = require('async');
var Flickr = require('flickrapi');
var FlickrAccounts = require('models/FlickrAccounts');

//global for this module to temporarily store flickrApiOptions
var tempOptionsStore = {};

//must have authentication
function flickrApiCallback(req, res) {
  if (tempOptionsStore[req.user.idUser] !== undefined &&
      req.query.oauth_token && req.query.oauth_verifier) {
    tempOptionsStore[req.user.idUser].exchange(req.query);
    //redirect back to main page
    res.redirect('/');
  }
}

function authenticateFlickrAccount(req, res, next) {
  //must temporarily store flickr options
  if (tempOptionsStore[req.user.idUser]) {
    return next(new Error('cannot authenticate at this time!'));
  }
  tempOptionsStore[req.user.idUser] = {
    api_key: req.user.apiKey,
    secret: req.user.apiKeySecret,
    permissions: 'delete',
    silent: true,
    callback: 'http://127.0.0.1:3000/auth/flickr/callback'
  };
  async.waterfall(
  [
    function(callback) {
      Flickr.authenticate(tempOptionsStore[req.user.idUser], callback);
    },
    function(flickr, callback) {
      FlickrAccounts.create(
        flickr.options.access_token,
        flickr.options.access_token_secret,
        req.user.idUser,
        callback);
    }
  ],
  function(err) {
    delete tempOptionsStore[req.user.idUser];
    if (err) { return next(err); }
    res.sendStatus(200);
  });
}

exports.flickrApiCallback = flickrApiCallback;
exports.authenticateFlickrAccount = authenticateFlickrAccount;