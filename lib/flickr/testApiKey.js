'use strict';
(require('rootpath')());

var async = require('async')
var Flickr = require('flickrapi');

/**
 * [testApiKey description]
 * @param  {string}   apiKey      
 * @param  {string}   apiKeySecret
 * @param  {Function} callback     [description]
 * args: err
 */
function testApiKey(apiKey, apiKeySecret, callback) {
  async.waterfall(
  [
    function(callback) {
      Flickr.tokenOnly({api_key: apiKey, secret: apiKeySecret}, callback);
    },
    function(flickr, callback) {
      flickr.blogs.getServices(function(err) {
        if (err) { return callback(new Error('invalid api key or secret!')); }
        callback(null);
      });
    }
  ],
  callback);
}

module.exports = testApiKey;