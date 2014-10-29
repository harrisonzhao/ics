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
 * Turn a url + query string into a Flickr API "base string".
 */
function formBaseString(verb, url, queryString) {
  return [
    verb, 
    encodeURIComponent(url), 
    encodeURIComponent(queryString)
  ].join('&');
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
 * HMAC-SHA1 data signing
 */
function sign(data, key, secret) {
  var hmacKey = key + '&' + (secret ? secret : ''),
      hmac = crypto.createHmac('SHA1', hmacKey);
  hmac.update(data);
  var digest = hmac.digest('base64');
  return encodeURIComponent(digest);
}

/**
 * returns the query object that enables the POST request to upload a photo
 * the POST request will return some xml (since json is broken for upload)
 * @param  {object} queryArguments
 * the object with arguments specified by 
 * https://www.flickr.com/services/api/upload.api.html
 * (excluding photo)
 * 
 * @param  {object} flickrOptions
 * must have fields:
 * api_key, access_token, secret, access_token_secret
 * 
 * @return {object}
 * with fields:
 * flickrURL is url to post to
 * formData is data that must be added to form
 */
function uploadQuery(queryArguments, flickrOptions) {
  flickrOptions = setAuthVals(flickrOptions);
  queryArguments.oauth_signature_method = 'HMAC-SHA1';
  queryArguments.oauth_consumer_key = flickrOptions.api_key;
  queryArguments.oauth_token = flickrOptions.access_token;
  queryArguments.oauth_nonce = flickrOptions.oauth_nonce;
  queryArguments.oauth_timestamp = flickrOptions.oauth_timestamp;

  // craft the authentication signature
  var url = 'https://up.flickr.com/services/upload/';
  var queryString = formQueryString(queryArguments);
  var data = formBaseString('POST', url, queryString);
  queryArguments.oauth_signature = sign(
          data, flickrOptions.secret, flickrOptions.access_token_secret);

  //form the URL to POST to
  var signature = '&oauth_signature=' + queryArguments.oauth_signature;
  var flickrURL = url + '?' + queryString + signature;

  //need to attach photo object to formData
  return {
    flickrURL: flickrURL,
    formData: queryArguments
  };
}

/**
 * returns the string to GET photos size urls (as json) for a given photo_id
 * @param  {object} queryArguments
 * must have only the field photo_id
 * 
 * @param  {object} flickrOptions
 * must have fields:
 * api_key, access_token, secret, access_token_secret
 * 
 * @return {string}
 * the signed url
 */
function getImageSizesQuery(queryArguments, flickrOptions) {
  flickrOptions = setAuthVals(flickrOptions);
  queryArguments.method = 'flickr.photos.getSizes';
  queryArguments.oauth_signature_method = 'HMAC-SHA1';
  queryArguments.oauth_consumer_key = flickrOptions.api_key;
  queryArguments.oauth_token = flickrOptions.access_token;
  queryArguments.oauth_nonce = flickrOptions.oauth_nonce;
  queryArguments.oauth_timestamp = flickrOptions.oauth_timestamp;
  queryArguments.format = 'json';

  //authentication signature
  var url = 'https://www.flickr.com/services/rest/';
  var queryString = formQueryString(queryArguments);
  var data = formBaseString('GET', url, queryString);
  queryArguments.oauth_signature = sign(
          data, flickrOptions.secret, flickrOptions.access_token_secret);

  //form the URL to GET from
  var signature = '&oauth_signature=' + queryArguments.oauth_signature;
  var flickrURL = url + '?' + queryString + signature;

  return flickrURL;
}

/**
 * returns the query object that enables the POST request to upload a photo
 * @param  {object} queryArguments
 * must have the fields: api_key, photo_id
 * 
 * @param  {object} flickrOptions
 * must have fields:
 * api_key, access_token, secret, access_token_secret
 * 
 * @return {string}
 * the signed url
 */
function deleteImage(queryArguments, flickrOptions) {
  flickrOptions = setAuthVals(flickrOptions);
  queryArguments.method = 'flickr.photos.delete';
  queryArguments.oauth_signature_method = 'HMAC-SHA1';
  queryArguments.oauth_consumer_key = flickrOptions.api_key;
  queryArguments.oauth_token = flickrOptions.access_token;
  queryArguments.oauth_nonce = flickrOptions.oauth_nonce;
  queryArguments.oauth_timestamp = flickrOptions.oauth_timestamp;

  // craft the authentication signature
  var url = 'https://www.flickr.com/services/rest/';
  var queryString = formQueryString(queryArguments);
  var data = formBaseString('POST', url, queryString);
  queryArguments.oauth_signature = sign(
          data, flickrOptions.secret, flickrOptions.access_token_secret);

  //form the URL to POST to
  var signature = '&oauth_signature=' + queryArguments.oauth_signature;
  var flickrURL = url + '?' + queryString + signature;

  return {
    flickrURL: flickrURL,
    formData: queryArguments
  };
}

exports.upload = uploadQuery;
exports.getImageSizes = getImageSizesQuery;
exports.deleteImage = deleteImage;