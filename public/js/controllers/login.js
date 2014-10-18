'use strict';

var login = angular.module('controllers.login', ['services.auth']);

function loginCtrl($scope, $location, Auth) {
  $scope.login = function(form) {
    Auth.login({
      email: $scope.user.email,
      password: $scope.user.password
    },
    function(err) {
      $scope.errors = {};

      if (!err) {
        $location.path('/');
      } else {
        angular.forEach(err, function(error, field) {
          form[field].$setValidity('db', false);
          $scope.errors[field] = error;
        });
      }

    });
  };
  
}

//Auth from services.auth
login.controller('LoginCtrl', ['$scope', '$location', 'Auth', loginCtrl]);