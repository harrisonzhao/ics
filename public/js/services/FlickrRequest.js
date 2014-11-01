'use strict';
/*global flickrUpload*/
//need to figure out what data looks like from responses!!!!
var flickrRequest = angular.module('services.flickrRequest', []);

// var Utils = {};
// Utils.handleURLRequest = function (verb, url, processResult, postdata) {
//     var xhr = new XMLHttpRequest();
//     xhr.open(verb, url, true);
//     xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     //xhr.setRequestHeader("Content-length", postdata.length);
//     //xhr.setRequestHeader("Connection", "close");
//     //xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//     /*if(postdata) {
//       xhr.setRequestHeader("Content-Type", "application/json");
//     }*/
//     xhr.onreadystatechange = function() {
//       if(xhr.readyState === 4) {
//         if(xhr.status == 200) {
//           var error = false,
//               body = xhr.responseText;
//           // we get a response, but there's no response body. That's a problem.
//           if(!body) {
//             error = "HTTP Error " + response.statusCode + " (" + statusCodes[response.statusCode] + ")";
//             return processResult(error);
//           }
//           // we get a response, and there were no errors
//           if(!error) {
//             try {
//               console.log(body);
//               body = body.trim().replace(/^jsonFlickrApi\(/,'').replace(/\}\)$/,'}');
//               body = JSON.parse(body);
//               if(body.stat !== "ok") {
//                 // There was a request error, and the JSON .stat property
//                 // will tell us what that error was.
//                 return processResult(body.message);
//               }
//             } catch (e) {
//               // general JSON error
//               return processResult("could not parse body as JSON");
//             }
//           }
//           // Some kind of other error occurred. Simply call the process
//           // handler blindly with both the error and error body.
//           processResult(error, body);
//         }
//         else { processResult("HTTP status not 200 (received "+xhr.status+")"); }
//       }
//     };
//     console.log(postdata);
//     xhr.send(postdata ? postdata : null);
//   };
//  Utils.errors = {
//     "96": {
//         "code": 96,
//         "message": "Invalid signature",
//         "_content": "The passed signature was invalid."
//     },
//     "97": {
//         "code": 97,
//         "message": "Missing signature",
//         "_content": "The call required signing but no signature was sent."
//     },
//     "98": {
//         "code": 98,
//         "message": "Login failed / Invalid auth token",
//         "_content": "The login details or auth token passed were invalid."
//     },
//     "99": {
//         "code": 99,
//         "message": "User not logged in / Insufficient permissions",
//         "_content": "The method requires user authentication but the user was not logged in, or the authenticated method call did not have the required permissions."
//     },
//     "100": {
//         "code": 100,
//         "message": "Invalid API Key",
//         "_content": "The API key passed was not valid or has expired."
//     },
//     "105": {
//         "code": 105,
//         "message": "Service currently unavailable",
//         "_content": "The requested service is temporarily unavailable."
//     },
//     "106": {
//         "code": 106,
//         "message": "Write operation failed",
//         "_content": "The requested operation failed due to a temporary issue."
//     },
//     "108": {
//         "code": "108",
//         "message": "Invalid frob",
//         "_content": "The specified frob does not exist or has already been used."
//     },
//     "111": {
//         "code": 111,
//         "message": "Format \"xxx\" not found",
//         "_content": "The requested response format was not found."
//     },
//     "112": {
//         "code": 112,
//         "message": "Method \"xxx\" not found",
//         "_content": "The requested method was not found."
//     },
//     "114": {
//         "code": 114,
//         "message": "Invalid SOAP envelope",
//         "_content": "The SOAP envelope send in the request could not be parsed."
//     },
//     "115": {
//         "code": 115,
//         "message": "Invalid XML-RPC Method Call",
//         "_content": "The XML-RPC request document could not be parsed."
//     },
//     "116": {
//         "code": 116,
//         "message": "Bad URL found",
//         "_content": "One or more arguments contained a URL that has been used for abuse on Flickr."
//     }
// };

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
