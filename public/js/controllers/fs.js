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
  $scope.nodes = [];//[{name: 'dave', idNode:1, isDirectory:1}, {name: 'katz', idNode:3, isDirectory:0}];
  $scope.currDirName = $rootScope.currentUser.currentDir.name;
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
        idParent: $rootScope.currentUser.currentDir.id || null,
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

  var changeDirectory = function(idNode, name) {
    VirtualFs.getDirectory(idNode, function(err, nodes) {
      if(err) { return console.log(err); }
      $rootScope.currentUser.currentDir = {id: idNode, name: name};
      $scope.currDirName = $rootScope.currentUser.currentDir.name;
      $scope.nodes = nodes;
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
      changeDirectory(idNode, name);
    } else {
      download(idNode);
    }
  }

  $scope.cdParent = function() {
    changeDirectory($rootScope.currentUser.currentDir.id, $rootScope.currentUser.currentDir.name);
  }
  
  changeDirectory(null, $rootScope.currentUser.currentDir.name);
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