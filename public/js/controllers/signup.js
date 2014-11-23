'use strict';

var signup = angular.module('controllers.signup', ['ngDialog','services.auth']);

function signupCtrl($scope, $rootScope, $location, ngDialog, Auth) {
  Auth.currentUser(function(err, result) {
    if (result) { $location.path('/fs'); }
  });

  $scope.register = function() {
    Auth.createUser({
      apiKey: $scope.user.apiKey,
      apiKeySecret: $scope.user.apiKeySecret,
      email: $scope.user.email,
      password: $scope.user.password  
    }, function(err) {
      if (err) {
        $scope.error = err;
      } else {
        $.get('/auth/flickr', function(data) {
          window.location = data;
        });
      }
    });
  }

  $scope.openDialog = function() {
    ngDialog.open({ 
      template: 'dialog', //references the id="dialog" element in signup.html
      className: 'ngdialog-theme-default ngdialog-theme-custom'
    });
  }
}

signup.controller('SignupCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  'ngDialog',
  'Auth',
  signupCtrl]);