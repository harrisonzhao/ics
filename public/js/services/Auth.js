/**
 * modifies $rootScope.currentUser
 * reference: https://docs.angularjs.org/api/ngResource/service/$resource
 * see config/passport.js for login parameters
 */
'use strict';
var auth = angular.module('services.auth', ['ngCookies']);

//TODO change routes
function userFactory($resource) {
  return $resource('/auth/user/');
}
auth.factory('User', ['$resource', userFactory]);

function sessionFactory($resource) {
  return $resource('/auth/session/');
}
auth.factory('Session', ['$resource', sessionFactory]);

function Auth($rootScope, $cookieStore, Session, User) {
  return {

    /**
     * [login description]
     * @param  {object}   user
     * must have fields: email, password
     * @param  {Function} callback
     * args: err
     */
    login: function(user, callback) {
      callback = callback || angular.noop;
      //post email and password to server
      Session.save({}, user, function(user) { //success
        $rootScope.currentUser = user;
        callback(null);
      }, function(err) {  //failure
        callback(err.data);
      });
    },

    logout: function(callback) {
      callback = callback || angular.noop;
      Session.delete({}, {}, function() {
        $rootScope.currentUser = null;
        callback();
      }, function(err) {
        callback(err.data);
      });
    },

    /**
     * [createUser description]
     * @param  {object}   userInfo
     * must have fields: 
     * apiKey, apiKeySecret, email, firstName, lastName, password
     * @param  {Function} callback
     * args: err
     */
    createUser: function(userInfo, callback) {
      callback = callback || angular.noop;
      User.save({}, userInfo, function(user) {
        $rootScope.currentUser = user;
        callback(null);
      }, function(err) {
        callback(err.data);
      });
    },

    //401 errors will be caught by a 401 error catcher in app.js
    currentUser: function(callback) {
      if ($rootScope.currentUser && $rootScope.currentUser.email) {
        return callback(null, $rootScope.currentUser);
      }
      User.get({}, function(user) {
        $rootScope.currentUser = user;
        if(callback) { callback(null, user); }
      }, function(err) {
        if (err && callback) { callback(err.data); }
      });
    }

  };
}

auth.factory(
  'Auth', 
  [
    '$rootScope',
    '$cookieStore',
    'Session',
    'User',
    Auth
  ]);