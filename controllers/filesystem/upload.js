'use strict';
(require('rootpath')());

var async = require('async');
var generateUploadUrl = require('lib/flickr/generateUploadUrl');

exports.generateUrl = function(req, res, next) {
  async.waterfall(
  [
    function(flickrOptions, callback) {
      generateUploadUrl(flickrOptions, function(result) {
        callback(null, result);
      });
    }
  ],
  function(err, result) {
    if (err) { return next(err); }
    res.send(result);
  });
}