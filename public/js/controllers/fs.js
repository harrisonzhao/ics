'use strict';
/*global async*/
var fs = angular.module('controllers.fs', [
  'services.vfs',
  'vendor.services.PNGStorage',
  'vendor.services.SaveFile',
  'directives.fileDropzone']);

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
  $scope.files = [];

  //for make directory
  $scope.newDirName = 'New Directory Name';

  //for ng-repeat  
  $scope.nodes = [];
  $scope.currDirName = $rootScope.currentUser.dirPath[
    $rootScope.currentUser.dirPath.length - 1].name;
  //prevent multiple clicks
  var cdInProgress = false;

  var changeDirectory = function(idNode, name, isChild) {
    if(cdInProgress) { return; }
    cdInProgress = true;
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
      if(err) { cdInProgress = false; return console.log(err); }
      $scope.currDirName = $rootScope.currentUser.dirPath[
        $rootScope.currentUser.dirPath.length - 1].name;
      $scope.nodes = nodes;
      cdInProgress = false;
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

  //assumes the existence of $scope.file and $scope.fileName
  //$files: an array of files selected, each file has name, size, and type.
  $scope.upload = function() {
    var file = $scope.files.shift();
    console.log(file);
    file.file = PNGStorage.encode(file.file);
    VirtualFs.upload(
      [{
        imgNum: 0,
        bytes: file.length,
        content: file.file
      }],
      {
        idParent: file.idParent,
        name: file.fileName,
        totalBytes: file.file.length,
        extension: file.fileName.split('.').pop()
      },
      function(err, idNode) {
        if(err) { return console.log(err); }
        $scope.nodes.push({
          idNode: idNode,
          isDirectory: false,
          name: file.fileName
        });
        sortNodes();
        //somehow add the resulting thing to list of files
      });
  };

  var deleteNode = function(idNode) {
    VirtualFs.delete(idNode, function(err) {
      if(err) { return console.log(err); }
    });
  };

  $scope.deleteClicked = function() {
    var toDelete = [];
    for(var i=0; i<$scope.nodes.length; i++){
      var clicked = $scope.nodes[i].clicked;
      if(clicked == 1){
        deleteNode($scope.nodes[i].idNode);
        toDelete.push(i);
      }
    }

    $scope.nodes = $scope.nodes.filter(function(element){
      return !(element.clicked == 1);
    });
  };

  $scope.makeDirectory = function() {
    var dirName = $scope.newDirName;
    var currentDirId = $rootScope.currentUser.dirPath[$rootScope.currentUser.dirPath.length - 1].id;
    VirtualFs.makeDirectory(dirName, currentDirId, function(err, idDirectory) {
      if(err) { return console.log(err); }
      $scope.nodes.push({
        idNode: idDirectory,
        isDirectory: 1,
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
  };

  $scope.cdParent = function() {
    if($rootScope.currentUser.dirPath.length > 1) {
      changeDirectory(
        $rootScope.currentUser.dirPath[
          $rootScope.currentUser.dirPath.length - 2].id, 
        $rootScope.currentUser.dirPath[
          $rootScope.currentUser.dirPath.length - 2].name,
        false);
    }
  };

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