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
  req.query.dirId = parseInt(req.query.dirId) || null;
  Nodes.selectByParentId(null, req.query.dirId, function(err, results) {
    err ? next(err) : res.send({data: results});
  });
}

//req must have the following in body
//images: array of images containing the following info per image
//imgNum, idImg, height, accessToken
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
//sends the following object
//fileName is filename of node
//getUrls is array or get requestable urls to get the images
function getDownloadFileData(req, res, next) {
  req.query.idNode = parseInt(req.query.idNode);
  if (!(req.query.idNode)) {
    return next(new Error('Missing some params'));
  }
  var images;
  var fileName;
  var accessTokenSecretPairs;
  async.watefall(
  [
    function(callback) {
      Nodes.selectById(req.query.idNode, function(err, node) {
        if(err) { callback(err); }
        fileName = node.name;
        if(node.isDirectory) {callback(new Error('node is a directory!'));}
        callback(null);
      });
    },
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
    err ? next(err) : res.send({fileName: fileName, getUrls: results });
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
  req.body.idNode = parseInt(req.body.idNode);
  if(!req.body.idNode) {
    return next(new Error('no directory or file specified!'));
  }
  Nodes.deleteNode(req.body.idNode, function(err) {
    err ? next(err) : res.sendStatus(200); 
  });
}

exports.makeDirectory = makeDirectory;
exports.getDirectory = getDirectory;
exports.createFile = createFile;
exports.getDownloadFileData = getDownloadFileData;
exports.getUploadFileData = getUploadFileData;
exports.deleteNode = deleteNode;