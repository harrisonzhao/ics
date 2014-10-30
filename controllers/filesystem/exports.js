'use strict';
(require('rootpath')());

var async = require('async');
var FlickrAccounts = require('models/FlickrAccounts');
var Nodes = require('models/Nodes');
var Images = require('models/Images');
var fsCreateFile = require('lib/fsModel/createFile');
var flickrWrappers = require('lib/flickr/signedWrappers');

//post
//req must provide currentDirId, dirName 
//currentDirId might be null if it's root directory
function makeDirectory(req, res, next) {
  if (!(req.body.dirName)) {
    return next(new Error('Missing some fields'));
  }
  if (req.body.currentDirId) {
    req.body.currentDirId = parseInt(req.body.currentDirId);
  }
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
//otherwise serve root directory
function getDirectory(req, res, next) {
  if (!req.query.dirId) {
    Nodes.selectRootDirectory(req.user.idUser, function(err, results) {
      err ? next(err) : res.send(results);
    });
  } else {
    req.query.dirId = parseInt(req.query.dirId);
    Nodes.selectByParentId(req.query.dirId, function(err, results) {
      err ? next(err) : res.send(results);
    });
  }
}

//req must have the following in body
//images: array of images containing the following info per image
//imgNum, idImg, height, width, bytes, accessToken
//metadata: idParent, name, totalBytes, extension
function createFile(req, res, next) {
  if (!(req.body.images instanceof Array && req.body.metadata)) {
    return next(new Error('Missing some fields'));
  }
  req.body.metadata.idParent = req.body.metadata.idParent || null;
  req.body.images = req.body.images.map(function(image) {
    return {
      imgNum: parseInt(image.imgNum),
      idImg: image.idImg,
      height: parseInt(image.height),
      width: parseInt(image.width),
      bytes: parseInt(image.bytes),
      accessToken: image.accessToken
    };
  });

  fsCreateFile(
    req.body.images, 
    req.body.metadata, 
    req.user, 
    function(err, idNode) {
      err ? next(err) : res.send(idNode);
    });
}

//GET
//must provide idNode
//sends the following
//
function getDownloadFileUrls(req, res, next) {
  if (!(req.query.idNode)) {
    return next(new Error('Missing some params'));
  }
  req.query.idNode = parseInt(req.query.idNode);
  var images;
  var accessTokenSecretPairs;
  async.watefall(
  [
    function(callback) {
      Images.selectByNodeId(req.query.idNode, function(err, results) {
        if(err) { return callback(err); }
        images = results;
        callback(null);
      });
    },
    function(callback) {
      FlickrAccounts.getAccessTokenSecretPairs(
        images.map(function(image) { return image.accessToken; }),
        function(err, results) {
          if(err) { return callback(err); }
          accessTokenSecretPairs = results;
          callback(null);
        });
    },
    function(callback) {
      callback(null, images.map(function(image) {
        return flickrWrappers.getImageSizes(
          req.user.apiKey,
          req.user.apiKeySecret,
          image.accessToken,
          accessTokenSecretPairs[image.accessToken]);
      }));
    }
  ],
  function(err, results) {
    err ? next(err) : res.send(results);
  });
}

//GET
//must provide title
//called once for every image
//if multiple images, called multiple times
//info contains: flickrURL and formData
//formData contains accessToken as access_token
function getUploadFileData(req, res, next) {
  if (!(req.query.title)) {
    return next(new Error('Missing some params'));
  }
  async.waterfall(
  [
    function(callback) {
      FlickrAccounts.selectBest(req.user.idUser, callback); 
    },
    function(accountInfo, callback) {
      callback(null, flickrWrappers.upload(
        req.user.apiKey,
        req.user.apiKeySecret,
        accountInfo.accessToken,
        accountInfo.accessTokenSecret,
        req.query.title));
    }
  ],
  function(err, info) {
    err ? next(err) : res.send(info);
  });
}

//POST
//need idNode for delete
function deleteNode(req, res, next) {
}

exports.makeDirectory = makeDirectory;
exports.getDirectory = getDirectory;
exports.createFile = createFile;
exports.getDownloadFileUrls = getDownloadFileUrls;
exports.getUploadFileData = getUploadFileData;
exports.deleteNode = deleteNode;