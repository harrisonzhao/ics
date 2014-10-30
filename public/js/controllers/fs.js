'use strict';

var fs = angular.module('controllers.fs', ['services.vfs', 'fileSystem']);

function fsCtrl($rootScope, $scope, VirtualFs, fileSystem) {
  $scope.upload = function() {
    
  };

  $scope.download = function() {

  };

  $scope.delete = function() {

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
    'fileSystem',
    fsCtrl
  ]);