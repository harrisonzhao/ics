'use strict';
var async = require('async');
var multiline = require('multiline');
var connection = require('config/db');
var trillionMinusTwoHundredMil = 999800000000;

var createQuery = multiline(function() {/*
  insert into FlickrAccounts (
    accessToken,
    accessTokenSecret,
    idUser
  ) values (?, ?, ?);
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
  select accessToken, accessTokenSecret, min(bytesUsed) AS bytes
  from FlickrAccounts
  where idUser = ?;
*/});
/**
 * [selectBest description]
 * @param  {int}   idUser   [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectBest(idUser, callback) {
  connection.query(selectBestQuery, [idUser], function(err, result) {
    if(err) { return callback(err); }
    if(!result[0]) { return callback(new Error('No accounts linked!')); }
    if(result.bytes > trillionMinusTwoHundredMil) {
      return callback(new Error(
        'Exceeded maximum storage on all accounts! Please create a new account.'
      ));
    }
    callback(null, result[0])
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

var selectSecretByTokenQuery = multiline(function() {/*
  select accessTokenSecret from FlickrAccounts
  where accessToken = ?;
*/});

function selectSecretByToken(token, callback) {
  connection.query(selectSecretByTokenQuery, [token], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}

function getAccessTokenSecretPairs(tokens, callback) {
  async.reduce(
    tokens,
    {}, 
    function(memo, token, callback) {
      selectSecretByToken(token, function(err, result) {
        if(err) { return callback(err); }
        memo[token] = result;
        callback(null, memo);
      });
    }, 
    callback);
}

exports.create = create;
exports.selectBest = selectBest;
exports.deleteByAccessToken = deleteByAccessToken;
exports.deleteById = deleteById;
exports.getAccessTokenSecretPairs = getAccessTokenSecretPairs;