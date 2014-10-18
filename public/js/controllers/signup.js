'use strict';

var signup = angular.module('controllers.signup', ['services.auth']);

function signupCtrl($scope, $location, Auth) {
  $scope.register = function() {
    Auth.createUser({
      apiKey: $scope.user.apiKey,
      apiKeySecret: $scope.user.apiKeySecret,
      email: $scope.user.email,
      firstName: $scope.user.firstName,
      lastName: $scope.user.lastName,
      password: $scope.user.password  
    }, function(err) {
      if (err) {
        $scope.error = err.message;
      } else {
        $location.path('/');
      }
    });
  }
}

signup.controller('SignupCtrl', ['$scope', '$location', 'Auth', signupCtrl]);