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
      apiKeySecret.length !== keyProperties.secretLength) {
    return callback(new Error());
  }
  async.waterfall(
  [
    function(callback) {
      Flickr.tokenOnly({api_key: apiKey, secret: apiKeySecret}, callback);
    },
    function(flickr, callback) {
      /*flickr.test.echo({}, function(err) {
        err ? callback(new Error()) : callback(null);
      });*/
      callback(null);
    }
  ],
  callback);
  // callback(null);
}

module.exports = testApiKey;