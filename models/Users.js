'use strict';
var multiline = require('multiline');
var bcrypt = require('bcryptjs');
var connection = require('config/db');

function comparePassword(password, passwordHash) {
  return password === passwordHash;
  //return bcrypt.compareSync(password, passwordHash);
}

var createQuery = multiline(function() {/*
  insert into Users (
    apiKey, 
    apiKeySecret,
    email,
    passwordHash
  ) values (?, ?, ?, ?);
*/});

/**
 * creates user given email and password
 * @param  {string}   apiKey        [description]
 * @param  {string}   apiKeySecret  [description]
 * @param  {string}   email         [description]
 * @param  {string}   password      [description]
 * @param  {Function} callback
 * args: err, result
 * result contains the insertId for the user
 */
function create(apiKey, apiKeySecret, email, password, callback) {
  connection.query(
    createQuery, 
    [apiKey, apiKeySecret, email, password], //bcrypt.hashSync(password,8)], 
    function(err, result) {
      err ? callback(err) : callback(null, result.insertId);
    });
}

var selectByIdQuery = multiline(function() {/*
  select * from Users where idUser = ?;
*/});

/**
 * [selectById description]
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectById(id, callback) {
  connection.query(selectByIdQuery, [id], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}

var selectByEmailQuery = multiline(function() {/*
  select * from Users where email = ?;
*/});

/**
 * [selectByEmail description]
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectByEmail(email, callback) {
  connection.query(selectByEmailQuery, [email], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}

var updateUserQuery = multiline(function() {/*
  update Users set
  apiKey = ?,
  apiKeySecret = ?,
  email = ?,
  passwordHash = ?
  where idUser = ?;
*/});

/**
 * @param  {object}   user
 * the user object
 * @param  {Function} callback [description]
 */
function update(user, callback) {
  connection.query(
    updateUserQuery, 
    [
      user.apiKey,
      user.apiKeySecret,
      user.email,
      user.passwordHash,
      user.idUser
    ],
    callback);
}

var deleteByIdQuery = multiline(function() {/*
  delete from Users
  where idUser = ?;
*/});

function deleteById(idUser, callback) {
  connection.query(deleteByIdQuery, [idUser], callback);
}

var deleteByEmailQuery = multiline(function() {/*
  delete from Users
  where email = ?;
*/});

function deleteByEmail(email, callback) {
  connection.query(deleteByEmailQuery, [email], callback);
}

exports.comparePassword = comparePassword;
exports.create = create;
exports.selectById = selectById;
exports.selectByEmail = selectByEmail;
exports.update = update;
exports.deleteById = deleteById;
exports.deleteUserByEmail = deleteByEmail;