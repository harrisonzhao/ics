'use strict';

var login = angular.module('controllers.front', []);

function Front($http) {
  var blah = $http.get('https://www.flickr.com/services/rest/?format=json&method=flickr.photos.getSizes&oauth_consumer_key=45a330b4bcbe145c9b8a7e53dfe21c56&oauth_nonce=7a00a9863b65c8847f5471c4736fdf59&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1414869717988&oauth_token=72157647421924547-33f5e8fee2329c42&photo_id=15315111257&oauth_signature=KSIZLMA06f%2FGJQ1i7Gq7w3tpqdE%3D');
  blah.success(function(data, status, headers, config) {
	  data = data.substring(14,data.length-14-1) + '}}';
	  //console.log(data);
	  var a = JSON.parse(data);
	  var orig = a.sizes.size[a.sizes.size.length-1]
	  var url = orig.source;
    var img = $http.get(url);
    img.success(function(data, status, headers, config) {
    	console.log(headers);
    }).
    error(function(data, status, headers, config) {
    	console.log('error img');
  	});
  }).
  error(function(data, status, headers, config) {
    console.log('error bitch');
  });
}

//Auth from services.auth
login.controller('FrontCtrl', ['$http', Front])