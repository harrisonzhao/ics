'use strict';
var generateSignedQueries = require('generateSignedQueries');

/**
 * wraps the generate upload object
 * which contains signed flickrURL and formData to POST
 * @param  {string} apiKey            
 * @param  {string} apiKeySecret      
 * @param  {string} accessToken       
 * @param  {string} accessTokenSecret 
 * @param  {string} title             title for file
 * @return {object}                   contains flickrURL and formData
 */
function upload(
  apiKey,
  apiKeySecret,
  accessToken,
  accessTokenSecret,
  title) {

  return generateSignedQueries.upload({
    title: title,
    is_public: 0,
    is_friend: 0,
    is_family: 0,
    hidden: 2
  }, {
    api_key: apiKey,
    secret: apiKeySecret,
    access_token: accessToken,
    access_token_secret: accessTokenSecret
  });
}
/**
 * wraps the generate getImageSizes url creator
 * @param  {string} apiKey            
 * @param  {string} apiKeySecret      
 * @param  {string} accessToken       
 * @param  {string} accessTokenSecret 
 * @param  {string} photoId           the id for the photo to get
 * @return {string}                   signed URL to GET
 */
function getImageSizes(
  apiKey,
  apiKeySecret,
  accessToken,
  accessTokenSecret,
  photoId) {

  return generateSignedQueries.getImageSizes({
    photo_id: photoId
  }, {
    api_key: apiKey,
    secret: apiKeySecret,
    access_token: accessToken,
    access_token_secret: accessTokenSecret
  })
}

exports.upload = upload;
exports.getImageSizes = getImageSizes;