//routes for serving JSON
'use strict';
(require('rootpath')());

module.exports = function(app) {
  var auth = require('controllers/auth');
  app.get('/auth/user', auth.checkLoggedIn, auth.getUserInfo);
  app.post('/auth/user', auth.signup);
  app.delete('/auth/session', auth.checkLoggedIn, auth.logout);
  app.post('/auth/session', auth.login);
  app.get('/logout', auth.logout);

  var vfs = require('controllers/filesystem/exports');
  app.post('/fs/directory', auth.checkLoggedIn, vfs.makeDirectory);
  app.get('/fs/directory', auth.checkLoggedIn, vfs.getDirectory);
  app.post('/fs/upload', auth.checkLoggedIn, vfs.createFile);
  app.get('/fs/upload', auth.checkLoggedIn, vfs.getUploadFileData);
  app.get('/fs/download', auth.checkLoggedIn, vfs.getDownloadFileData);
  app.delete('/fs/delete', auth.checkLoggedIn, vfs.deleteNode);
  app.get('/fs/png', auth.checkLoggedIn, vfs.getBase64Png);

  var flickrAuth = require('controllers/flickrAuth/oauth');
  app.get('/auth/flickr', flickrAuth.authenticate);
  app.get('/auth/flickr/callback', flickrAuth.flickrCallback);
};