'use strict';
var async = require('async');
var connection = require('config/db');
var Nodes = require('models/Nodes');
var Images = require('models/Images');

//images: array of images containing the following info per image
//imgNum, idImg, bytes, accessToken
//metadata: idParent, name, totalBytes, extension
//idOwner: user id of owner
//callback takes args: err, insertedNodeId
function create(images, metadata, idOwner, callback) {
  var image = images[0];
  console.log(images);
  console.log(metadata);
  var idNode;
  async.waterfall(
  [
    // function(callback) {
    //   connection.beginTransaction(function(err) {
    //     err ? callback(err) : callback(null);
    //   });
    // },
    function(callback) {
      Nodes.insertFile(
        metadata.idParent, 
        idOwner, 
        metadata.name,
        function(err, result) {
          if(err) { return callback(err); }
          idNode = result;
          callback(null);
        });
    },
    function(callback) {
      Images.create(image, callback);
    }
    // function(callback) {
    //   connection.commit(callback);
    // }
  ],
  function(err) {
    // if (err) {
    //   connection.rollback(function(err) {
    //     if (err) { return callback(new Error('error with database rollback!'));}
    //     return callback(new Error('could not store file in database!'));
    //   });
    // }
    err ? callback(err) : callback(null, idNode);
  });
}

module.exports = create;