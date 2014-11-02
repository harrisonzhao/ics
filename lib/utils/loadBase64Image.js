var request = require('request');

/**
 * @param  {string}   url
 * flickr url to get
 * @param  {Function} callback
 * args: err, base64encodedstring
 */
var loadBase64Image = function (url, callback) {
  // Make request to our image url
  request({url: url, encoding:'base64'}, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      // So as encoding set to null then request body became Buffer object
      var base64prefix = 'data:' + res.headers['content-type'] + ';base64,';
      if (typeof callback == 'function') {
          callback(null, base64prefix, body);
      }
    } else {
      callback(new Error('Could not download image!'));
    }
  });
};

module.exports = loadBase64Image;