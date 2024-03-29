'use strict';
/*global flickrUpload*/
/*global async*/
//need to figure out what data looks like from responses!!!!
var flickrRequest = angular.module('services.flickrRequest', [
  'vendor.services.PNGStorage']);

function dataURLToBlob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = decodeURIComponent(parts[1]);

    return new Blob([raw], {type: contentType});
  }

  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {type: contentType});
}

function FlickrRequest($http, PNGStorage) {
  return {
    //data is all fields of post request excluding photo
    //photo is a base64 string
    upload: function(url, data, photo, callback) {
      var binary = photo.replace(/^data:image\/(png|jpg);base64,/, '');
      binary = atob(binary);
      var photoId = flickrUpload.post(data, url, binary);
      if(photoId !== 'error') {
        callback(null, photoId);
      } else {
        callback(photoId);
      }
    },

    //gets the base64 representation of png
    //converts it to blob
    download: function(url, callback) {
      async.waterfall(
      [
        function(callback) {
          $http.get(url)
            .success(function(data) {
              data = data.substring(14,data.length-14-1) + '}}';
              data = JSON.parse(data);
              var original = data.sizes.size[data.sizes.size.length-1];
              callback(null, original.source);
            })
            .error(function() {
              callback('Could not download data!');
            });
        },
        function(sourceUrl, callback) {
          PNGStorage.decode(sourceUrl, function(data) {
            callback(null, dataURLToBlob(data));
          });
        }
      ],
      function(err, result) {
        callback(err, result);
      });

    },

    delete: function(url, data, callback) {
      $http.post(url, data).
        success(function(data, status, headers, config) {
          console.log(data, status, headers, config);
          callback(null, data);
        }).
        error(function(data, status, headers, config) {
          console.log(data, status, headers, config);
          callback(data);
        });
    },
  };
}

flickrRequest.factory('FlickrRequest', [
  '$http', 'PNGStorage', FlickrRequest]);
