'use strict';
(require('rootpath')());

var async = require('async');
var Nodes = require('models/Nodes');
var fsCreateFile = require('lib/fsModel/createFile');
var flickrWrappers = require('lib/flickr/signedWrappers');

//post
//req must provide currentDirId, dirName 
function makeDirectory(req, res, next) {
  if (!(req.body.currentDirId && req.body.dirName)) {
    return next(new Error('Missing some fields'));
  }
  req.body.currentDirId = parseInt(req.body.currentDirId);
  Nodes.insertDirectory(
    req.body.currentDirId,
    req.user.idUser,
    req.body.dirName,
    function(err, id) {
      err ? next(err) : res.send(id);
    }); 
}

//get
//gets all files in a given directory
//req must provide dirId
function changeDirectory(req, res, next) {
  if (!req.query.dirId) {
    return next(new Error('Missing some query params'));
  }
  req.query.dirId = parseInt(req.query.dirId);
  Nodes.selectByParentId(req.query.dirId, function(err, result) {
    err ? next(err) : res.send(result);
  });
}

//req must have the following in body
//images: array of images containing the following info per image
//imgNum, idImg, height, width, bytes, accessToken
//metadata: idParent, name, totalBytes, extension
function createFile(req, res, next) {
  if (!(req.body.images && req.body.metadata)) {
    return next(new Error('Missing some fields'));
  }
  //may have to store bytes as string
  //TODO: need to convert image width and height and imgNum and bytes to int
  fsCreateFile(
    req.body.images, 
    req.body.metadata, 
    req.user, 
    function(err, idNode) {
      err ? next(err) : res.send(idNode);
    });
}

//must provide node id
function downloadFile(req, res, next) {

}

function deleteNode(req, res, next) {
//??
}

exports.makeDirectory = makeDirectory;
exports.changeDirectory = changeDirectory;
exports.createFile = createFile;
exports.downloadFile = downloadFile;
exports.deleteNode = deleteNode;