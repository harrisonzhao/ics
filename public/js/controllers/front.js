'use strict';

var login = angular.module('controllers.front', ['vendor.services.SaveFile']);

function Front($http, SaveFile) {
  $http.get('/data').
  success(function(data, status, headers, config) {
    console.log(data, status, headers, config);
    // this callback will be called asynchronously
    // when the response is available
  }).
  error(function(data, status, headers, config) {
    console.log(data, status, headers, config);
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  }); // var formdata = {
  //    hidden: '2',
  //    is_public: 0,
  //    is_friend: 0,
  //    is_family: 0,
  //    oauth_consumer_key: '45a330b4bcbe145c9b8a7e53dfe21c56',
  //    oauth_nonce: '261393b51ac2b10826fe55c8acd01324',
  //    oauth_signature: 'c27zYeWYFVracd%2BuJ%2FLJByHTIag%3D',
  //    oauth_signature_method: 'HMAC-SHA1',
  //    oauth_timestamp: '1414854231719',
  //    oauth_token: '72157647421924547-33f5e8fee2329c42',
  //    //oauth_version: '1.0',
  //    title: 'fuckingshit8'
  // }
  // // function _base64ToArrayBuffer(base64) {
  // //   var binary_string =  window.atob(base64);
  // //   var len = binary_string.length;
  // //   var bytes = new Uint8Array( len );
  // //   for (var i = 0; i < len; i++)        {
  // //       var ascii = binary_string.charCodeAt(i);
  // //       bytes[i] = ascii;
  // //   }
  // //   return bytes.buffer;
  // // }
  // var binary = photo.replace(/^data:image\/(png|jpg);base64,/, "");
  // binary = atob(binary);
  // var photoid = flickrUpload.post(formdata, url, binary);
  // console.log(photoid);
  //photo = _base64ToArrayBuffer(photo);
 //  formdata.photo = photo;
 //  formdata = Object.keys(formdata).map(function(key) {
 //    return key + '=' + formdata[key];
 //  }).reduce(function(previousValue, currentValue){
 //    return previousValue + '&' + currentValue;
 //  });
 //  //console.log(formdata)
  // FlickrRequest.upload(url, formdata, function(err,result){
  //  console.log(err);
  //  console.log(result);
  // });
}

//Auth from services.auth
login.controller('FrontCtrl', ['$http', 'SaveFile', Front])