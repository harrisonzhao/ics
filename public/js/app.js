'use strict';
/*global angular*/

var app = angular.module('infiniteCloudStorage', [
  'services.auth',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'http-auth-interceptor',
  'ui.bootstrap',
  'controllers.login',
  'controllers.signup',
  'controllers.front',
  'controllers.fs'
]);

function configApp($httpProvider, $routeProvider, $locationProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $routeProvider
    /*.when('/', {
      templateUrl: 'partials/main.html',
      controller: 'MainCtrl'
    })*/
    .when('/', {
      templateUrl: 'partials/front.html',
      controller: 'FrontCtrl'
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl'
    })
    .when('/signup', {
      templateUrl: 'partials/signup.html',
      controller: 'SignupCtrl'
    })
    .when('/fs', {
      templateUrl: 'partials/filesystem.html',
      controller: 'FsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}

app.config([
  '$httpProvider',
  '$routeProvider', 
  '$locationProvider', 
  configApp
]);

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
    if (currentUser && 
      (['/','/login','/logout','/signup'].indexOf($location.path()) !== -1)) {
      $location.path('/fs');
    }
  });

  // On catching 401 errors, redirect to the login page.
  $rootScope.$on('event:auth-loginRequired', function() {
    $location.path('/login');
    return false;
  });
});