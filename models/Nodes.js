'use strict';
var multiline = require('multiline');
var bcrypt = require('bcryptjs');
var connection = require('config/db');

var selectByParentIdQuery = multiline(function() {/*
  select * from Nodes where idParent = ?;
*/});

/**
 * [selectByParent Gets all subfiles of the parent]
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectByParentId(id, callback) {
  connection.query(selectByParentIdQuery, [id], function(err, result) {
    err ? callback(err) : callback(null, result);
  });
}

var selectByUserIdQuery = multiline(function() {/*
  select * from Nodes where idOwner = ? AND ISNULL(idParent);
*/});

/**
 * [selectByUserId Gets the root directory contents for a user]
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectByUserId(id, callback) {
  connection.query(selectByUserIdQuery, [id], function(err, result) {
    err ? callback(err) : callback(null, result);
  });
}

var selectByChildIdQuery = multiline(function() {/*
  select * from Nodes where idNode = ?;
*/});

/**
 * [selectByChildId Gets the info for a node]
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectByChildId(id, callback) {
  connection.query(selectByChildIdQuery, [id], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}

exports.selectByParentId = selectByParentId;
exports.selectByUserId = selectByUserId;
exports.selectByChildId = selectByChildId;