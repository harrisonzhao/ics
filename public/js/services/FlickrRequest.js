'use strict';
//need to figure out what data looks like from responses!!!!
var flickrRequest = angular.module('services.flickrRequest', []);

function FlickrRequest($http) {
  return {
    upload: function(url, data, callback) {
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

    download: function(url, callback) {
      $http.get(url).
        success(function(data, status, headers, config) {
          console.log(data, status, headers, config);
          callback(null, data);
        }).
        error(function(data, status, headers, config) {
          console.log(data, status, headers, config);
          callback(data);
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
