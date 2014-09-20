'use strict';
var multiline = require('multiline');
var connection = require('config/configs').mysql;
//add user
//params: (flickrId, flickrOAuthToken, flickrOAuthSecret)
//
//get user by profile id (string)

var addUserQuery = multiline(function() {/*

*/});
function addUser(flickrId, flickrOAuthToken, flickrOAuthSecret, callback) {

}

var selectUserQuery = multiline(function() {/*
  select * from Users where flickrId = ?;
*/});
function selectUserById(flickrId, callback) {
  connection.query(selectUserQuery, [flickrId], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}