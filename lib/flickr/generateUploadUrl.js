/**
 * file containing logic for creating the url necessary for uploading a photo
 * exports function that returns an object containing the url to POST to
 * and the data (excluding the photo field) to accompany the POST
 * this is safe: the api_secret and token_secret are not exposed to the client
 */
'use strict';
var crypto = require('crypto');

/**
 * Update an options object for use with Flickr oauth
 * so that it has a new timestampe and nonce.
 */
function setAuthVals(options) {
  var timestamp = '' + Date.now();
  var md5 = crypto.createHash('md5').update(timestamp).digest('hex');
  var nonce = md5.substring(0,32);
  options.oauth_timestamp = timestamp;
  options.oauth_nonce = nonce;
  return options;
}

/**
 * creates post query arguments for post photo
 * see https://www.flickr.com/services/api/auth.oauth.html
 * and https://www.flickr.com/services/api/upload.api.html
 */
function createQueryArguments(flickrOptions) {
  //intial args
  var queryArguments = {};
  //public cannot view the photo
  queryArguments.is_public = 0;
  //photo is hidden from public searches
  queryArguments.hidden = 2;

  //auth stuff using flickrOptions
  queryArguments.oauth_nonce = flickrOptions.oauth_nonce;
  queryArguments.oauth_timestamp = flickrOptions.oauth_timestamp;
  queryArguments.oauth_consumer_key = flickrOptions.api_key;
  queryArguments.oauth_token = flickrOptions.access_token;
  queryArguments.oauth_signature_method = 'HMAC-SHA1';
  queryArguments.format = 'json';
  return queryArguments;
}

/**
 * Collapse a number of oauth query arguments into an
 * alphabetically sorted, URI-safe concatenated string.
 */
function formQueryString(queryArguments) {
  var args = [];
  var append = function(key) {
    args.push(key + '=' + queryArguments[key]);
  };
  Object.keys(queryArguments).sort().forEach(append);
  return args.join('&');
}

/**
 * Turn a url + query string into a Flickr API 'base string'.
 */
function formBaseString(url, queryString) {
  return ['POST', encodeURIComponent(url), encodeURIComponent(queryString)]
          .join('&');
}

/**
 * HMAC-SHA1 data signing
 */
function sign(data, key, secret) {
  var hmacKey = key + '&' + secret;
  var hmac = crypto.createHmac('SHA1', hmacKey);
  hmac.update(data);
  var digest = hmac.digest('base64');
  return encodeURIComponent(digest);
}

/**
 * returns an object that the client side can use to perform a CORS request
 * the object is incomplete as the data needs to be augmented with a photo field
 * @param  {object} flickrOptions
 * flickrOptions must contain fields:
 *   api_key
 *   secret
 *   access_token
 *   access_token_secret
 * @param  {function} callback
 * args: incomplete object for posting, must also attach photo to data
 */
function formQueryObject(flickrOptions, callback) {
  process.nextTick(function() {
    flickrOptions = setAuthVals(flickrOptions);
    var queryArguments = createQueryArguments(flickrOptions);

    var url = 'https://up.flickr.com/services/upload/';
    var queryString = formQueryString(queryArguments);
    var data = formBaseString(url, queryString);
    var signature = '&oauth_signature=' + 
            sign(data, flickrOptions.secret, flickrOptions.access_token_secret);
    var flickrURL = url + '?' + queryString + signature;
    callback({
      url: flickrURL,
      data: queryArguments
    });

  });
}

module.exports = formQueryObject;