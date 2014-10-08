//file used to load other routes
'use strict';
(require('rootpath')());

var express = require('express');
var app = module.exports = express();
var configs = require('config/configs');
configs.configure(app);

//endpoints:
//==========
var auth = require('controllers/auth');
app.post('/auth/signup', auth.signup);
app.post('/auth/login', auth.login);
app.delete('/auth/session', auth.checkLoggedIn, auth.logout);




//create a file
//download(read) a file
//update a file (replace old file)
//delete a file


var options = {
    api_key: '45a330b4bcbe145c9b8a7e53dfe21c56',
    secret: 'e175d4c4458c0e0f',
    access_token: '72157647421924547-33f5e8fee2329c42',
    access_token_secret: 'd0e63b4b168ed94d',
    permissions: 'delete'
  };
options.callback = 'http://127.0.0.1:3000/auth/flickr/callback';

//app.get('/auth/flickr', auth.flickrAuth);
app.get('/auth/flickr/callback', function(req, res) {
  console.log('hiiii');
  console.log(req.query);

  console.log('whyyyy');
  options.exchange(req.query);
  res.redirect('/');
  console.log('whaaaaa');
});

// app.all('*', auth.checkLoggedIn);
// app.get('/profile', staticPages.renderProfile);

// app.get('*', staticPages.serve404);

/**
 * handles the errors when next(err) is called
 */
//var errorHandler = require('controllers/errorHandler').errorHandler;
//app.use(errorHandler);

app.listen(configs.settings.secrets.port);
console.log('listening on port ' + configs.settings.secrets.port);

var Flickr = require('flickrapi');
//console.log(configs.settings.auth.flickrAuth)
app.get('/hi', function(req, res) {
  Flickr.authenticate(options, function(error, flickr) {
    error ? console.log(error) : console.log(flickr);
  });
})
