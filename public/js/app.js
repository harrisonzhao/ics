'use strict';
/*global angular*/

var app = angular.module('infiniteCloudStorage', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'http-auth-interceptor',
  'ui.bootstrap'
]);

app.config(
  [
    '$routeProvider', 
    '$locationProvider'
  ], 
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  });

app.run(function ($rootScope, $location, Auth) {

  //watching the value of the currentUser variable.
  $rootScope.$watch('currentUser', function(currentUser) {
    // if no currentUser and on a page that requires authorization 
    // then try to update it
    // will trigger 401s if user does not have a valid session
    if (!currentUser && 
      (['/','/login','/logout','/signup'].indexOf($location.path()) === -1)) {
      Auth.currentUser();
    }
  });

  // On catching 401 errors, redirect to the login page.
  $rootScope.$on('event:auth-loginRequired', function() {
    $location.path('/login');
    return false;
  });
});