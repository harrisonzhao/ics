'use strict';
var fs = angular.module('controllers.fs', [
  'services.vfs',
  'vendor.services.PNGStorage',
  'angularFileUpload',
  'ngDialog',
  'ngDraggable',
  'services.auth',
  'vendor.services.SaveFile']);

//gotta make the title the non png file??
function fsCtrl($scope, $http, ngDialog, VirtualFs, PNGStorage, SaveFile, Auth){
  $scope.currentNodeId;
  $scope.currentNodeName;

  $scope.files = [];
  var rootDirObj = {id: null, name: 'Root'};
  $scope.dirPath = [rootDirObj];

  //for make directory
  //$scope.newDirName = 'New Directory Name';

  //for ng-repeat  
  $scope.nodes = [];
  $scope.currDirName = $scope.dirPath[$scope.dirPath.length - 1].name;
  $scope.currDirId = $scope.dirPath[$scope.dirPath.length - 1].id;

  //prevent multiple clicks
  var cdInProgress = false;
  
  //
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
      $scope.currDirId = $scope.dirPath[
        $scope.dirPath.length - 1].id;
      $scope.nodes = nodes;
      cdInProgress = false;
    });
  };

  var download = function(idNode, name) {
    //result contains binary data
    VirtualFs.downloadFile(idNode, function(err, result) {
      if(err) { return console.log(err); }
      SaveFile.save(result, name);
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
    //replace all special characters too for good measure
    //this is because uploading to flickr with special characters causes problems when putting it in request url
    var fileName = $scope.uploadFileName.replace(/ /g,'_');
    fileName = fileName.replace(/[`%&+\-=?]/gi, '_');
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
      $scope.currentNodeId = idNode;
      $scope.currentNodeName = name;
      ngDialog.open({
        template: 'downloadDialog',
        className: 'ngdialog-theme-default ngdialog-theme-custom',
        scope: $scope
      });
    }
  };

  //used in dialog box
  $scope.downloadFile = function() {
    download($scope.currentNodeId, $scope.currentNodeName);
  }

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

  $scope.openTutorial = function() {
    ngDialog.open({
      //references id="tutorialDialog" element in filesystem.html
      template: 'tutorialDialog', 
      className: 'ngdialog-theme-default ngdialog-theme-custom'
    });
  };

  //moves the child into parent
  $scope.onDropComplete = function(child, parent){
    var childId = child.idNode;
    var parentId = parent.idNode;
    //if moving file to parent directory
    if (parentId !== null && parentId === $scope.currDirId &&
        $scope.dirPath.length > 1) {
      parentId = $scope.dirPath[$scope.dirPath.length - 2].id;
    }
    $http.post('/fs/move', {
      childId: childId,
      parentId: parentId
    }).success(function() {
      //NOTE: I don't check for name conflicts when moving
      //ignore if in root moving to root
      if (parentId !== null || $scope.currDirId !== null) {
        for (var i = 0; i < $scope.nodes.length; ++i) {
          if ($scope.nodes[i].idNode === childId) {
            $scope.nodes.splice(i, 1);
          }
        }
      }
    }).error(function(data) {
      console.log(data.data);
    });
  }

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
    '$http',
    'ngDialog',
    'VirtualFs',
    'PNGStorage',
    'SaveFile',
    'Auth',
    fsCtrl
  ]);