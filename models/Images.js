'use strict';
var multiline = require('multiline');
var connection = require('config/db');

var selectByNodeIdQuery = multiline(function () {/*
  select * from Images WHERE idNode = ?;
*/});

/**
 * [getFileImages Get File Images]
 * args: err, result
 */
function selectByNodeId(nid, callback) {
  connection.query(selectByNodeIdQuery, [nid], function(err, result) {
    err ? callback(err) : callback(null, result);
  });
}

var createQuery = multiline(function () {/*
  insert into Images(imgNum, idImg, height, width, bytes, accessToken)
  values(?, ?, ?, ?, ?, ?);
*/});
/**
 * @param  {object}   metadata
 * must contain fields: imgNum, idNum, height, width, bytes, accessToken
 * @param  {Function} callback
 * args: err, id of inserted
 */
function create(metadata, callback) {
  connection.query(
    createQuery, 
    [
      metadata.imgNum,
      metadata.idNum,
      metadata.height,
      metadata.width,
      metadata.bytes,
      metadata.accessToken
    ], 
    function(err, result) {
      err ? callback(err) : callback(null, result.insertId);
    });
}

exports.create = create;
exports.selectByNodeId = selectByNodeId;