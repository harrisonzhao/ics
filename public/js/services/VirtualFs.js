'use strict';
/*global async*/

var virtualfs = angular.module('services.vfs', ['fileSystem']);

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

function VirtualFs($rootScope, Directory, Upload, Download, fileSystem) {
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
    //imgNum, idImg, height, width, bytes, accessToken
    //metadata: idParent, name, totalBytes, extension
    createFile: function(images, metadata, callback) {
      async.waterfall(
      [
        function(callback) {

        },
        function(callback) {

        }
      ],
      function(err) {

      });
    },

    downloadFile: function(idNode, callback) {
      Download.$get({idNode: idNode}, function(url) {

      }, function(err) {
        callback(err.data);
      }); 
    },

    uploadFilePart: function() {

    }

    //for each filePart uploadFilePart
    //createFile
  };
}

virtualfs.factory(
  'VirtualFs', 
  [
    '$rootScope',
    'Directory',
    'Upload',
    'Download',
    'fileSystem', //from vendor/angular-filesystem
    virtualfs
  ]);