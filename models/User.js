'use strict';
var multiline = require('multiline');
var bcrypt = require('bcryptjs');
var connection = require('config/db');

function comparePassword(user, password, callback) {
  return bcrypt.compareSync(password, user.passwordHash);
}

var createQuery = multiline(function() {/*
  insert into Users (email, passwordHash) values (?, ?);
*/});

/**
 * creates user given email and password
 * @param  {[type]}   email    [description]
 * @param  {[type]}   password [description]
 * @param  {Function} callback
 * args: err, result
 * result contains the inserted Id for the user
 */
function create(email, password, callback) {
  connection.query(
    createQuery, 
    [email, bcrypt.hashSync(password,8)], 
    function(err, result) {
      err ? callback(err) : callback(null, result.insertId);
    });
}

var selectByIdQuery = multiline(function() {/*
  select * from Users where userId = ?;
*/});

/**
 * [selectById description]
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectById(id, callback) {
  connection.query(selectByIdQuery, [id], callback);
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
  connection.query(selectByEmailQuery, [email], callback);
}

var updateUserQuery = multiline(function() {/*
  update Users set
  email = ?,
  passwordHash = ?
  where userId = ?;
*/});

/**
 * @param  {object}   user
 * the user object
 * @param  {Function} callback [description]
 */
function update(user, callback) {
  connection.query(
    updateUserQuery, 
    [user.email, user.password_hash, user.user_id],
    callback);
}

var deleteByIdQuery = multiline(function() {/*
  delete from Users
  where userId = ?;
*/});

function deleteById(userId, callback) {
  connection.query(deleteByIdQuery, [userId], callback);
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