'use strict';

var login = angular.module('controllers.login', ['services.auth']);

function loginCtrl($scope, $rootScope, $location, Auth) {
  Auth.currentUser(function(err, result) {
    if (result) { $location.path('/fs'); }
  });
  $scope.login = function() {
    Auth.login({
      email: $scope.user.email,
      password: $scope.user.password
    },
    function(err) {
      if (err) {
        $scope.error = err;
      } else {
        $location.path('/');
      }
    });
  };
}

//Auth from services.auth
login.controller('LoginCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  'Auth',
  loginCtrl]);