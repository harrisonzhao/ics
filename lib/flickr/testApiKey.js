'use strict';
(require('rootpath')());

var async = require('async')
var Flickr = require('flickrapi');
var keyProperties = require('config/settings/exports').flickrKeyProperties;

/**
 * [testApiKey description]
 * @param  {string}   apiKey      
 * @param  {string}   apiKeySecret
 * @param  {Function} callback     [description]
 * args: err
 */
function testApiKey(apiKey, apiKeySecret, callback) {
  if (apiKey.length !== keyProperties.apiKeyLength || 
    apiKeySecret !== keyProperties.secretLength) {
    return callback(false);
  }
  async.waterfall(
  [
    function(callback) {
      Flickr.tokenOnly({api_key: apiKey, secret: apiKeySecret}, callback);
    },
    function(flickr, callback) {
      flickr.blogs.getServices(function(err) {
        if (err) { return callback(false); }
        callback(null);
      });
    }
  ],
  callback);
}

module.exports = testApiKey;