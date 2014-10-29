'use strict';
var multiline = require('multiline');
var bcrypt = require('bcryptjs');
var connection = require('config/db');

var selectByParentIdQuery = multiline(function() {/*
  select * from Nodes where idParent = ? AND idOwner = ?;
*/});

var selectByParentIdNullQuery = multiline(function() {/*
  select * from Nodes where idOwner = ? AND ISNULL(idParent);
*/});

/**
 * [selectByParent Gets all subfiles of the parent]
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectByParentId(nid, uid, callback) {
	if(nid != null){
	  connection.query(selectByParentIdQuery, [nid, uid], function(err, result) {
	    err ? callback(err) : callback(null, result);
	  });
	}
	else{
		connection.query(selectByParentIdNullQuery, [uid], function(err, result) {
	    err ? callback(err) : callback(null, result);
	  });
	}
}

var selectByChildIdQuery = multiline(function() {/*
  select * from Nodes where idNode = ? AND idOwner = ?;
*/});

/**
 * [selectByChildId Gets the info for a node]
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * args: err, result
 */
function selectByChildId(nid, uid, callback) {
  connection.query(selectByChildIdQuery, [nid, uid], function(err, result) {
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

var selectFileImagesQuery = multiline(function () {/*
	select * from Images WHERE idNode = ?;
*/});

/**
 * [getFileImages Get File Images]
 * args: err, result
 */
 function selectFileImages(nid, callback) {
  connection.query(selectFileImagesQuery, [nid], function(err, result) {
    err ? callback(err) : callback(null, result);
  });
}

exports.selectByParentId = selectByParentId;
exports.selectByChildId = selectByChildId;
exports.insertDirectory = insertDirectory;
exports.selectFileImages = selectFileImages;