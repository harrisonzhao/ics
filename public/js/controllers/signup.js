'use strict';

var signup = angular.module('controllers.signup', ['services.auth']);

function signupCtrl($scope, $location, Auth) {
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
        $location.path('/auth/flickr');
      }
    });
  }
}

signup.controller('SignupCtrl', [
  '$scope',
  '$location',
  'Auth',
  signupCtrl]);