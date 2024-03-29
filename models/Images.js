'use strict';
var multiline = require('multiline');
var connection = require('config/db');

var selectByNodeIdQuery = multiline(function () {/*
  select * from Images WHERE idNode = ? ORDER BY imgNum ASC;
*/});

/**
 * [getFileImages Get File Images]
 * args: err, results
 */
function selectByNodeId(nid, callback) {
  connection.query(selectByNodeIdQuery, [nid], function(err, results) {
    err ? callback(err) : callback(null, results);
  });
}

var createQuery = multiline(function () {/*
  insert into Images(idNode, imgNum, idImg, bytes, accessToken)
  values(?, ?, ?, ?, ?);
*/});
/**
 * @param  {object}   metadata
 * must contain fields: idNode, imgNum, idNum, bytes, accessToken
 * @param  {Function} callback
 * args: err, id of inserted
 */
function create(metadata, callback) {
  connection.query(
    createQuery, 
    [
      metadata.idNode,
      metadata.imgNum,
      metadata.idImg,
      metadata.bytes,
      metadata.accessToken
    ], 
    function(err, result) {
      err ? callback(err) : callback(null, result.insertId);
    });
}

exports.create = create;
exports.selectByNodeId = selectByNodeId;