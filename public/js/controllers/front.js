'use strict';

var login = angular.module('controllers.front', []);

function Front($location) {
  $location.path('/login');
}

//Auth from services.auth
login.controller('FrontCtrl', ['$location', Front]);