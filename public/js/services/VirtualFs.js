'use strict';
/*global async*/

var virtualfs = angular.module('services.vfs', ['services.flickrRequest']);

function directoryFactory($resource) {
  return $resource('/fs/directory');
}
virtualfs.factory('Directory', ['$resource', directoryFactory]);

function uploadFactory($resource) {
  return $resource('/fs/upload');
}
virtualfs.factory('Upload', ['$resource', uploadFactory]);

function downloadFactory($resource) {
  return $resource('/fs/download');
}
virtualfs.factory('Download', ['$resource', downloadFactory]);

function deleteFactory($resource) {
  return $resource('/fs/delete');
}
virtualfs.factory('Delete', ['$resource', deleteFactory]);

function VirtualFs(Directory, Upload, Download, Delete, FlickrRequest) {
  return {
    makeDirectory: function(dirName, callback) {
      Directory.$save({}, {dirName: dirName}, function(directoryId) {
        callback(null, directoryId);
      }, function(err) {
        callback(err.data);
      });
    },

    getDirectory: function(dirId, callback) {
      Directory.$get({dirId: dirId}, function(nodes) {
        callback(null, nodes);
      }, function(err) {
        callback(err.data);
      });
    },

    //images: array of images containing the following info per image
    //imgNum, bytes, content (actual image content as png base64 encoded)
    //metadata: idParent, name, totalBytes, extension
    //currently need all images in ram (probably not good idea long-run)
    //CURRENTLY ONLY SUPPORT ONLY 1 element in images
    //callback args: err, result
    createFile: function(images, metadata, callback) {
      //lol :D
      var image = images[0];
      async.waterfall(
      [
        function(callback) {
          Upload.$get({title: metadata.name}, function(data) {
            callback(null, data);
          }, function(err) {
            callback(err.data);
          });
        },
        function(postInfo, callback) {
          postInfo.formData.photo = image.content;
          FlickrRequest.upload(
            postInfo.flickrURL,
            postInfo.formData,
            function(err, idImg) {
              if (err) { return callback(err); }
              callback(null, idImg, postInfo.formData.access_token);
            });
        },
        function(imageId, accessToken, callback) {
          Upload.$save({}, {
            images: [{
              imgNum: image.imgNum,
              idImg: imageId,
              bytes: image.bytes,
              accessToken: accessToken
            }],
            metadata: metadata
          }, function(idNode) {
            callback(null, idNode);
          }, function(err) {
            callback(err.data);
          });
        }
      ],
      function(err, idNode) {
        callback(err, idNode);
      });
    },

    //callback args:err, result
    //result is an object of image content and title
    downloadFile: function(idNode, callback) {
      //info will contain url and name
      Download.$get({idNode: idNode}, function(info) {
        FlickrRequest.download(url, callback);
      }, function(err) {
        callback(err.data);
      }); 
    },

    delete: function(idNode, callback) {
      Delete.$delete({}, {idNode: idNode}, function() {
        callback(null);
      }, function(err) {
        callback(err.data);
      });
    }

  };
}

virtualfs.factory(
  'VirtualFs', 
  [
    'Directory',
    'Upload',
    'Download',
    'Delete',
    'FlickrRequest',
    VirtualFs
  ]);