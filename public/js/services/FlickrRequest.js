'use strict';
/*global flickrUpload*/
//need to figure out what data looks like from responses!!!!
var flickrRequest = angular.module('services.flickrRequest', []);

function FlickrRequest($http) {
  return {
    //data is all fields of post request excluding photo
    //photo is a base64 string
    upload: function(url, data, photo, callback) {
      var binary = photo.replace(/^data:image\/(png|jpg);base64,/, '');
      binary = atob(binary);
      var photoId = flickrUpload.post(data, url, binary, callback);
      if(photoId !== 'error') {
        callback(null, photoId);
      } else {
        callback(photoId);
      }
    },

    download: function(url, callback) {
      //Utils.handleURLRequest('GET', url, callback);
      // $http.get(url).
      //   success(function(data, status, headers, config) {
      //     console.log(data, status, headers, config);
      //     callback(null, data);
      //   }).
      //   error(function(data, status, headers, config) {
      //     console.log(data, status, headers, config);
      //     callback(data);
      //   });

      var blah = $http.get(url);
      blah.success(function(data, status, headers, config) {
        data = data.substring(14,data.length-14-1) + '}}';
        //console.log(data);
        var a = JSON.parse(data);
        var orig = a.sizes.size[a.sizes.size.length-1]
        var url = orig.source;
        var img = $http.get(url);
        img.success(function(data, status, headers, config) {
          callback(data);
        }).
        error(function(data, status, headers, config) {
          callback(data);
        });
      }).
      error(function(data, status, headers, config) {
        console.log('error bitch');
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

flickrRequest.factory('FlickrRequest', ['$http', FlickrRequest]);
