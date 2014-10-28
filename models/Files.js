'use strict';
var multiline = require('multiline');
var connection = require('config/db');

var createQuery = multiline(function () {/*
  insert into Files(idNode, extension, totalBytes)
  values(?, ?, ?);
*/});
/**
 * @param  {object}   metadata
 * must contain fields: imgNum, idNum, height, width, bytes, accessToken
 * @param  {Function} callback
 * args: err, id of inserted
 */
function create(idNode, extension, totalBytes, callback) {
  connection.query(
    createQuery, 
    [idNode, extension, totalBytes], 
    function(err, result) {
      err ? callback(err) : callback(null, result.insertId);
    });
}

exports.create = create;