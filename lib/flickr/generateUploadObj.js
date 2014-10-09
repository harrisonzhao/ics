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
  var timestamp = "" + Date.now();
  var md5 = crypto.createHash('md5').update(timestamp).digest("hex");
  var nonce = md5.substring(0,32);
  options.oauth_timestamp = timestamp;
  options.oauth_nonce = nonce;
  return options;
}

/**
 * Turn a url + query string into a Flickr API "base string".
 */
function formBaseString(verb, url, queryString) {
  return [
    verb, 
    encodeURIComponent(url), 
    encodeURIComponent(queryString)
  ].join("&");
}

/**
 * Collapse a number of oauth query arguments into an
 * alphabetically sorted, URI-safe concatenated string.
 */
function formQueryString(queryArguments) {
  var args = [];
  var append = function(key) {
    args.push(key + "=" + queryArguments[key]);
  };
  Object.keys(queryArguments).sort().forEach(append);
  return args.join("&");
}

/**
 * HMAC-SHA1 data signing
 */
function sign(data, key, secret) {
  var hmacKey = key + "&" + (secret ? secret : ''),
      hmac = crypto.createHmac("SHA1", hmacKey);
  hmac.update(data);
  var digest = hmac.digest("base64");
  return encodeURIComponent(digest);
}

/**
 * returns the query object that enables the POST request to upload a photo
 * @param  {object} photoOptions
 * the object with arguments specified by 
 * https://www.flickr.com/services/api/upload.api.html
 * (excluding photo)
 * @param  {object} flickrOptions
 * 
 * @return {[type]}               [description]
 */
function formQueryObject(photoOptions, flickrOptions) {
  flickrOptions = setAuthVals(flickrOptions);
  photoOptions.oauth_signature_method = "HMAC-SHA1";
  photoOptions.oauth_consumer_key = flickrOptions.api_key;
  photoOptions.oauth_token = flickrOptions.access_token;
  photoOptions.oauth_nonce = flickrOptions.oauth_nonce;
  photoOptions.oauth_timestamp = flickrOptions.oauth_timestamp;

  // craft the authentication signature
  var url = "https://up.flickr.com/services/upload/";
  var queryString = formQueryString(photoOptions);
  var data = formBaseString("POST", url, queryString);
  photoOptions.oauth_signature = sign(
          data, flickrOptions.secret, flickrOptions.access_token_secret);

  // and finally, form the URL we need to POST to
  var signature = "&oauth_signature=" + photoOptions.oauth_signature;
  var flickrURL = url + "?" + queryString + signature;
  //need to attach photo object to form
  return {
    flickrURL: flickrURL,
    formData: photoOptions
  };
}

module.exports = formQueryObject;