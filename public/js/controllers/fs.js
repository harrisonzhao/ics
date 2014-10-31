'use strict';

var fs = angular.module('controllers.fs', [
  'services.vfs',
  'vendor.services.PNGStorage'
  ]);

//gotta make the title the non png file??
function fsCtrl($rootScope, $scope, VirtualFs, PNGStorage) {
  //uses $rootScope.currentUser.dirPath to determine idParent (parent node id)
  //to be in conjunction with dropzone directive
  //ex:
  //dropzone="upload()"
  //assumes the existence of $scope.file and $scope.fileName
  $scope.upload = function() {
    var image = PNGStorage.encode($scope.file);
    VirtualFs.upload(
      [image],
      {
        idParent: $rootScope.currentUser.dirPath[
          $rootScope.currentUser.dirPath.length - 1] || null,
        name: $scope.fileName,
        totalBytes: image.length,
        extension: $scope.fileName.split('.').pop()
      },
      function(err, idNode) {
        //somehow add the resulting thing to list of files
      });
  };

  $scope.download = function(idNode) {
    VirtualFs.downloadFile(idNode, function(err, result) {
      //if(err) {}
      
    });
  };

  $scope.delete = function(idNode) {
    VirtualFs.delete(idNode, function(err) {

    });
  };

  $scope.changeDirectory = function() {

  };

  $scope.makeDirectory = function() {

  };
}

fs.controller('fsCtrl', 
  [
    '$rootScope',
    '$scope',
    'VirtualFs',
    'PNGStorage',
    fsCtrl
  ]);