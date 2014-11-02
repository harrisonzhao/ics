'use strict';
var fs = angular.module('controllers.fs', [
  'services.vfs',
  'vendor.services.PNGStorage',
  'vendor.services.SaveFile',
  'angularFileUpload',
  'services.auth']);

//gotta make the title the non png file??
function fsCtrl($rootScope, $scope, VirtualFs, PNGStorage, SaveFile, Auth) {
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
    //result contains fileName and content fields
    VirtualFs.downloadFile(idNode, function(err, result) {
      if(err) { return console.log(err); }
      SaveFile.save(result.content, result.fileName);
    });
  };

/*var UploadController = function ($scope, fileReader) {
     
    $scope.readFile = function () {            
        fileReader.readAsDataUrl($scope.file, $scope)
                  .then(function(result) {
                        $scope.imageSrc = result;
                    });
    };
};*/
  //assumes the existence of $scope.file and $scope.fileName
  //$files: an array of files selected, each file has name, size, and type.
  $scope.upload = function() {
    var checkSize = function(size) {
      var _ref;
      if (((_ref = 200) === (void 0) || _ref === '') || 
          (size / 1024) / 1024 < 200) {
        return true;
      } else {
        alert('File must be smaller than ' + 200 + ' MB');
        return false;
      }
    };
    if (!checkSize($scope.uploadFileSize)) {
      return;
    }

    var file = $scope.uploadFile;
    //can't have spaces in file name
    var fileName = $scope.uploadFileName.replace(/ /g,'_');
    file = PNGStorage.encode(file);
    VirtualFs.createFile(
      [{
        imgNum: 0,
        bytes: $scope.uploadFileSize,
        content: file
      }],
      {
        idParent: $rootScope.currentUser.dirPath[
          $rootScope.currentUser.dirPath.length - 1].id,
        name: fileName,
        totalBytes: $scope.uploadFileSize,
        extension: $scope.uploadFileName.split('.').pop()
      },
      function(err, idNode) {
        if(err) { return console.log(err); }
        $scope.nodes.push({
          idNode: idNode,
          isDirectory: false,
          name: fileName
        });
      });
  };

  $scope.onFileSelect = function($files) {
    var file = $files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      return $scope.uploadFile = e.target.result;
    };
    $scope.uploadFileName = file.name;
    $scope.uploadFileSize = file.size;
    return reader.readAsDataURL(file);
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

  $scope.logout = function() {
    Auth.logout();
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
    'Auth',
    fsCtrl
  ]);