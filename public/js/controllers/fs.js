'use strict';
/*global async*/
var fs = angular.module('controllers.fs', [
  'services.vfs',
  'vendor.services.PNGStorage',
  'vendor.services.SaveFile'
  ]);

var cmp = function(a, b) {
    if (a > b) { return +1; }
    if (a < b) { return -1; }
    return 0;
}

var sortNodes = function(nodes) {
  nodes = nodes.sort(function(a, b) {
    return cmp(a.isDirectory,b.isDirectory) || cmp(a.name,b.name);
  });
};

//gotta make the title the non png file??
function fsCtrl($rootScope, $scope, VirtualFs, PNGStorage, SaveFile) {
  //for ng-repeat  
  $scope.nodes = [];
  $scope.currDirName = $rootScope.currentUser.dirPath[
    $rootScope.currentUser.dirPath.length - 1].name;
  //prevent multiple clicks
  var clicked = false;

  var changeDirectory = function(idNode, name, isChild) {
    if(clicked) { return; }
    clicked = true;
    //must handle case of multiple clicks in short span of time,
    //can't include something included once already
    if(isChild) {
      $rootScope.currentUser.dirPath.push({
        id: idNode,
        name: name
      });
    } else if($rootScope.currentUser.dirPath.length > 1) {
      $rootScope.currentUser.dirPath.pop();
    }

    VirtualFs.getDirectory(idNode, function(err, nodes) {
      if(err) { clicked = false; return console.log(err); }
      $scope.currDirName = $rootScope.currentUser.dirPath[
        $rootScope.currentUser.dirPath.length - 1].name;
      $scope.nodes = nodes;
      clicked = false;
    });
  };

  var download = function(idNode) {
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
      if(err) { return console.log(err); }
      SaveFile.save(dataURLpng, fileName);
    });
  };

  //uses $rootScope.currentUser.currentDir to determine idParent(parent node id)
  //^ contains an object with fields: id and name
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
          $rootScope.currentUser.dirPath.length - 1].id || null,
        name: $scope.fileName,
        totalBytes: image.length,
        extension: $scope.fileName.split('.').pop()
      },
      function(err, idNode) {
        if(err) { return console.log(err); }
        $scope.nodes.push({
          idNode: idNode,
          isDirectory: false,
          name: $scope.fileName
        });
        sortNodes();
        //somehow add the resulting thing to list of files
      });
  };

  $scope.delete = function(idNode) {
    VirtualFs.delete(idNode, function(err) {
      if(err) { return console.log(err); }
      var deleteIndex = $scope.nodes.map(function(node) {
        return node.idNode;}
      ).indexOf(idNode);
      if (deleteIndex > -1) {
        $scope.nodes.splice(idNode, 1);
      }
    });
  };

  $scope.makeDirectory = function(dirName) {
    var currentDirId = $rootScope.currentUser.currentDir.id;
    VirtualFs.makeDirectory(dirName, currentDirId, function(err, idDirectory) {
      if(err) { return console.log(err); }
      $scope.nodes.push({
        idNode: idDirectory,
        isDirectory: true,
        name: dirName
      });
    });
  };

  $scope.clickNode = function(idNode, name, isDirectory) {
    if(isDirectory) {
      changeDirectory(idNode, name, true);
    } else {
      download(idNode);
    }
  }

  $scope.cdParent = function() {
    if($rootScope.currentUser.dirPath.length > 1) {
      changeDirectory(
        $rootScope.currentUser.dirPath[
          $rootScope.currentUser.dirPath.length - 2].id, 
        $rootScope.currentUser.dirPath[
          $rootScope.currentUser.dirPath.length - 2].name,
        false);
    }
  }

  //initialize with root directory
  changeDirectory(
    null,
    $rootScope.currentUser.dirPath[0].name,
    false);
}

fs.controller('FsCtrl', 
  [
    '$rootScope',
    '$scope',
    'VirtualFs',
    'PNGStorage',
    'SaveFile',
    fsCtrl
  ]);