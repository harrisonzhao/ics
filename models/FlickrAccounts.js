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
/**
 * [create description]
 * @param  {[type]}   accessToken       [description]
 * @param  {[type]}   accessTokenSecret [description]
 * @param  {[type]}   idUser            [description]
 * @param  {Function} callback          [description]
 * args: err
 */
function create(accessToken, accessTokenSecret, idUser, callback) {
  connection.query(
    createQuery, 
    [accessToken, accessTokenSecret, idUser],
    //must be called like this or else there might also be a result
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
/**
 * [selectBest description]
 * @param  {int}   idUser   [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectBest(idUser, callback) {
  connection.query(selectBestQuery, [idUser], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}

var deleteByAccessToken = multiline(function() {/*
  delete from FlickrAccounts
  where accessToken = ?;
*/});
/**
 * [deleteByAccessToken description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 * args: err
 */
function deleteByAccessToken(token, callback) {
  connection.query(deleteByAccessToken, [token], callback);
}

var deleteByIdQuery = multiline(function() {/*
  delete from FlickrAccounts
  where idUser = ?;
*/});
/**
 * [deleteById description]
 * @param  {[type]}   idUser   [description]
 * @param  {Function} callback [description]
 * args: err
 */
function deleteById(idUser, callback) {
  connection.query(deleteByIdQuery, [idUser], callback);
}