'use strict';
var multiline = require('multiline');
var connection = require('config/configs').mysql;

var addUserQuery = multiline(function() {/*
  INSERT INTO Users (flickrID,oauth,secret)
  VALUES (?, ?, ?);
*/});

function add(flickrId, flickrOAuthToken, flickrOAuthSecret, callback) {
  connection.query(
    addUserQuery, 
    [flickrId, flickrOAuthToken, flickrOAuthSecret], 
    callback);
}

var updateUserQuery = multiline(function() {/*
  UPDATE Users
  SET oauth=?,secret=?
  WHERE flickrID=?;
*/});
function update(flickrId, flickrOAuthToken, flickrOAuthSecret, callback) {
  connection.query(
    updateUserQuery, 
    [flickrOAuthToken, flickrOAuthSecret, flickrId], 
    callback);
}

var selectUserQuery = multiline(function() {/*
  SELECT * FROM Users 
  WHERE flickrID = ?;
*/});
function select(flickrId, callback) {
  connection.query(selectUserQuery, [flickrId], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}

exports.add = add;
exports.update = update;
exports.selectById = select;

//Test Dem Queries
/*
add('12','34','56',function(err){
  if(err) console.log(err);
});

update('12','133123','2323231',function(err){
  if(err) console.log(err);
});

select('12', function(err, result){
	err ? console.log(err) : console.log(result);
});
*/
