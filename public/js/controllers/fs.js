'use strict';
/*global async*/
var fs = angular.module('controllers.fs', [
  'services.vfs',
  'vendor.services.PNGStorage',
  'vendor.services.SaveFile'
  ]);

//gotta make the title the non png file??
function fsCtrl($rootScope, $scope, VirtualFs, PNGStorage, SaveFile) {
  //probably need to store an array of shit somewhere to ng-repeat
  //like
  
  $scope.nodes = [];
  //still need initialization tho

  //uses $rootScope.currentUser.dirPath to determine idParent (parent node id)
  //to be in conjunction with dropzone directive
  //ex:
  //dropzone="upload()"
  //assumes the existence of $scope.file and $scope.fileName
  $scope.upload = function() {
    var image = PNGStorage.encode($scope.file);
    VirtualFs.upload(
      [{
        imgNum: 0,
        bytes: image.length,
        content: image
      }],
      {
        idParent: $rootScope.currentUser.dirPath[
          $rootScope.currentUser.dirPath.length - 1] || null,
        name: $scope.fileName,
        totalBytes: image.length,
        extension: $scope.fileName.split('.').pop()
      },
      function(err, idNode) {
        if(err) { return console.log(err); }
        //somehow add the resulting thing to list of files
      });
  };

  $scope.download = function(idNode) {
    async.waterfall(
    [
      function(callback) {
        VirtualFs.downloadFile(idNode, callback);
      },
      //result contains fields content and fileName
      function(result, callback) {
        PNGStorage.decode(result.content, function(data) {
          callback(null, data, result.fileName);
        });
      }
    ],
    function(err, dataURLpng, fileName) {
      //handle err if err
      if(err) { return console.log(err); }
      SaveFile.save(dataURLpng, fileName);
    });
  };

  $scope.delete = function(idNode) {
    VirtualFs.delete(idNode, function(err) {
      if(err) { return console.log(err); }
      //else remove it from view
    });
  };

  $scope.changeDirectory = function(idNode) {
    VirtualFs.getDirectory(idNode, function(err, nodes) {
      if(err) { return console.log(err); }
      $rootScope.currentUser.dirPath.push(idNode);
      //display the nodes
    });
  };

  $scope.makeDirectory = function(dirName) {
    VirtualFs.makeDirectory(dirName, function(err, idDirectory) {
      if(err) { return console.log(err); }
      //add the directory id and name to list of stuff
    });
  };
}

fs.controller('fsCtrl', 
  [
    '$rootScope',
    '$scope',
    'VirtualFs',
    'PNGStorage',
    'SaveFile',
    fsCtrl
  ]);