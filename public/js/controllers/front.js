'use strict';

var login = angular.module('controllers.front', ['services.auth']);

function Front($location, Auth) {
  //for now redirect to either login or filesystem since no landing page
  Auth.currentUser(function(err) {
    if (err) {
      $location.path('/login');
    } else {
      $location.path('/fs');
    }
  });
}

//Auth from services.auth
login.controller('FrontCtrl', ['$location', 'Auth', Front]);