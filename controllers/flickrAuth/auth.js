'use strict';
(require('rootpath')());

var Flickr = require('flickrapi');

//global for this module to temporarily store flickrApiOptions
var tempOptionsStore = {};

//must have authentication
function flickrApiCallback(req, res) {
  if (tempOptionsStore[req.user.idUser] !== undefined &&
      req.query.oauth_token && req.query.oauth_verifier) {
    tempOptionsStore[req.user.idUser].exchange(req.query);
    //redirect to page that closes
    res.render('close');
  }
}

function authenticateFlickrKeys(req, res, next) {
// gotta store the flickr options
  tempOptionsStore[req.user.idUser] = {
    api_key: '45a330b4bcbe145c9b8a7e53dfe21c56',
    secret: 'e175d4c4458c0e0f',
    //access_token: '72157647421924547-33f5e8fee2329c42',
    //access_token_secret: 'd0e63b4b168ed94d',
    permissions: 'delete',
    silent: true,
    callback: 'http://127.0.0.1:3000/auth/flickr/callback'
  };
  Flickr.authenticate(tempOptionsStore[req.user.idUser], function(error, flickr) {
    if (error) {
      delete tempOptionsStore[req.user.idUser];
      return next(error); 
    }
    var uploadOptions = {
      photos: [{
        title: 'test',
        photo: __dirname + '/../../public/img/img008.jpg'
      }]
    }
    console.log(flickr.options);
    Flickr.upload(uploadOptions, flickr.options, function(err, result) {
      if(err) {
        return console.error(error);
      }
      console.log("photos uploaded", result);
    });
    delete tempOptionsStore[req.user.idUser];
    res.sendStatus(200);
  });
}

exports.flickrApiCallback = flickrApiCallback;
exports.authenticateFlickrKeys = authenticateFlickrKeys;