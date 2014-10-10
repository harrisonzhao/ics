'use strict';
var multiline = require('multiline');
var connection = require('config/db');

var createQuery = multiline(function() {/*
  insert into FlickrAccounts (
    accessToken,
    accessTokenSecret,
    idUser
  ) values (?, ?, ?, ?);
*/});
function create(accessToken, accessTokenSecret, idUser, callback) {
  connection.query(
    createQuery, 
    [accessToken, accessTokenSecret, idUser], 
    function(err) {
      callback(err);
    });
}

var selectBestQuery = multiline(function() {/*
  select accessToken, accessTokenSecret 
  from FlickrAccounts
  where bytesUsed = (
    select min(bytesUsed)
    from FlickrAccounts
    where idUser = ?
  ) LIMIT 1;
*/});
function selectBest(idUser, callback) {
  connection.query(selectBestQuery, [idUser], function(err, result) {
    err ? callback(err) : callback(result[0]);
  });
}

var deleteByAccessToken = multiline(function() {/*
  delete from FlickrAccounts
  where accessToken = ?;
*/});
function deleteByAccessToken(token, callback) {
  connection.query(deleteByAccessToken, [token], callback);
}

var deleteByIdQuery = multiline(function() {/*
  delete from FlickrAccounts
  where idUser = ?;
*/});
function deleteById(idUser, callback) {
  connection.query(deleteByIdQuery, [idUser], callback);
}