'use strict';
var fs = angular.module('controllers.fs', [
  'services.vfs',
  'vendor.services.PNGStorage',
  'vendor.services.SaveFile',
  'angularFileUpload',
  'ngDialog',
  'services.auth']);

//gotta make the title the non png file??
function fsCtrl($scope, ngDialog, VirtualFs, PNGStorage, SaveFile, Auth) {
  $scope.files = [];
  var rootDirObj = {id: null, name: 'Root'};
  $scope.dirPath = [rootDirObj];

  //for make directory
  //$scope.newDirName = 'New Directory Name';

  //for ng-repeat  
  $scope.nodes = [];
  $scope.currDirName = $scope.dirPath[$scope.dirPath.length - 1].name;

  //prevent multiple clicks
  var cdInProgress = false;
  
  var changeDirectory = function(idNode, name, isChild) {
    if(cdInProgress) { return; }
    cdInProgress = true;
    //must handle case of multiple clicks in short span of time,
    //can't include something included once already
    if(isChild) {
      $scope.dirPath.push({
        id: idNode,
        name: name
      });
    } else if($scope.dirPath.length > 1) {
      $scope.dirPath.pop();
    }

    VirtualFs.getDirectory(idNode, function(err, nodes) {
      if(err) { cdInProgress = false; return console.log(err); }
      $scope.currDirName = $scope.dirPath[
        $scope.dirPath.length - 1].name;
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

  //assumes the existence of $scope.uploadFile and $scope.uploadFileName
  //$files: an array of files selected, each file has name, size, and type.
  $scope.upload = function() {
    var checkSize = function(size) {
      if (size < 550) {
        alert('File must be larger than ' + 600 + ' bytes');
        return false;
      }
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
        idParent: $scope.dirPath[
          $scope.dirPath.length - 1].id,
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
    var currentDirId = $scope.dirPath[$scope.dirPath.length - 1].id;
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
    if($scope.dirPath.length > 1) {
      changeDirectory(
        $scope.dirPath[
          $scope.dirPath.length - 2].id, 
        $scope.dirPath[
          $scope.dirPath.length - 2].name,
        false);
    }
  };

  $scope.addAccount = function() {
    $.get('/auth/flickr', function(data) {
      window.location = data;
    });
  };

  $scope.logout = function() {
    Auth.logout();
  };

  $scope.openDialog = function() {
    ngDialog.open({ 
      template: 'dialog', //references id="dialog" element in filesystem.html
      className: 'ngdialog-theme-default ngdialog-theme-custom'
    });
  };

  //get the user
  Auth.currentUser(function(err, user) {
    if(err) { return console.log(err); }
    $scope.currentUser = user;
    if (user.numAccounts === 0) {
      //check if there's a Flickr Account attached, if not show dialog
      $scope.openDialog();
    }
  });
  //initialize with root directory
  changeDirectory(null, $scope.currDirName, false);

}

fs.controller('FsCtrl', 
  [
    '$scope',
    'ngDialog',
    'VirtualFs',
    'PNGStorage',
    'SaveFile',
    'Auth',
    fsCtrl
  ]);