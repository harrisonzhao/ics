'use strict';
var async = require('async');
var connection = require('config/db');
var Files = require('models/Files');
var Nodes = require('models/Nodes');
var Images = require('models/Images');

//images: array of images containing the following info per image
//imgNum, idImg, height, width, bytes, accessToken
//metadata: idParent, name, totalBytes, extension
//user: user object from req.user
//callback takes args: err, insertedNodeId
function create(images, metadata, user, callback) {
  var idNode;
  async.waterfall(
  [
    function(callback) {
      connection.beginTransaction(callback);
    },
    function(callback) {
      Nodes.insertFile(
        metadata.idParent, 
        user.idUser, 
        metadata.name,
        function(err, result) {
          if(err) { return callback(err); }
          idNode = result;
          callback(null);
        });
    },
    function(callback) {

      async.each(images, function(image, callback) {
        //do not pass in the returned id for image to callback
        Images.create(image, function(err) { callback(err); });
      }, function(err) {
        err ? callback(err) : callback(null);
      });

    },
    function(callback) {
      Files.create(
        idNode, 
        metadata.extension, 
        metadata.totalBytes, 
        function(err) {
          err ? callback(err) : callback(null);
        });
    },
    function(callback) {
      connection.commit(callback);
    }
  ],
  function(err) {
    if (err) {
      connection.rollback(function(err) {
        if (err) { return callback(new Error('error with database rollback!'));}
        return callback(new Error('could not store file in database!'));
      });
    }
    callback(null, idNode);
  });
}

module.exports = create;