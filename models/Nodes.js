'use strict';
var multiline = require('multiline');
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
function selectByParentId(nid, callback) {
  connection.query(selectByParentIdQuery, [nid], function(err, result) {
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
function selectByUserId(uid, callback) {
  connection.query(selectByUserIdQuery, [uid], function(err, result) {
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
function selectByChildId(nid, callback) {
  connection.query(selectByChildIdQuery, [nid], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}

var insertDirectoryQuery = multiline(function () {/*
	insert into Nodes (idParent, idOwner, isDirectory, name)
	values(?, ?, 1, ?);
*/});

/**
 * [insertDirectory Insert a directory]
 * args: err, result
 */
function insertDirectory(idParent, idOwner, name, callback) {
  connection.query(
    insertDirectoryQuery,
    [idParent, idOwner, name], 
    function(err, result) {
      err ? callback(err) : callback(null, result.insertId);
    });
}

var insertFileQuery = multiline(function () {/*
  insert into Nodes (idParent, idOwner, isDirectory, name)
  values(?, ?, 0, ?);
*/});
//might want to create a trigger to assert that the directory actually exists
//images is a list of images with info needed for database
//directoryId is directory id of directory node is in
//fileMetadata is object containing the fields
//  extension, idOwner, totalBytes
function insertFile(idParent, idOwner, name, callback) {
  connection.query(
    insertFileQuery,
    [idParent, idOwner, name], 
    function(err, result) {
      err ? callback(err) : callback(null, result.insertId);
    }); 
}

var deleteNodeQuery = multiline(function () {/*
  delete from Nodes where idNode = ?;
*/});
function deleteNode(nid, callback) {
  connection.query(deleteNodeQuery, [nid], callback);
}

exports.selectByParentId = selectByParentId;
exports.selectByUserId = selectByUserId;
exports.selectByChildId = selectByChildId;
exports.insertDirectory = insertDirectory;
exports.insertFile = insertFile;
exports.deleteNode = deleteNode;