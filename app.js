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


// var options = {
//     api_key: '45a330b4bcbe145c9b8a7e53dfe21c56',
//     secret: 'e175d4c4458c0e0f',
//     //access_token: '72157647421924547-33f5e8fee2329c42',
//     //access_token_secret: 'd0e63b4b168ed94d',
//     permissions: 'delete'
//   };
// options.callback = 'http://127.0.0.1:3000/auth/flickr/callback';

// //app.get('/auth/flickr', auth.flickrAuth);
// app.get('/auth/flickr/callback', function(req, res) {
//   console.log('hiiii');
//   console.log(req.session);
//   console.log(req.query);
//   console.log('whyyyy');
//   options.exchange(req.query);
//   res.redirect('/');
//   console.log('whaaaaa');
// });

// app.all('*', auth.checkLoggedIn);
// app.get('/profile', staticPages.renderProfile);

// app.get('*', staticPages.serve404);

/**
 * handles the errors when next(err) is called
 */
//var errorHandler = require('controllers/errorHandler').errorHandler;
//app.use(errorHandler);

var flickrAuth = require('./controllers/flickrAuth/auth');
app.get('/auth/flickr/callback', function(req, res) {
  req.user = {};
  req.user.idUser = 1;
  flickrAuth.flickrApiCallback(req, res);
});
app.get('/hi', function(req, res, next) {
  console.log('hi');
  req.user = {};
  req.user.idUser = 1;
  flickrAuth.authenticateFlickrKeys(req, res, next);
});
app.listen(configs.settings.secrets.port);
console.log('listening on port ' + configs.settings.secrets.port);

var Flickr = require('flickrapi');
Flickr.tokenOnly(
{
  api_key:'2b31b1da603a3d701f173aae3a3337b4',
  secret: 'dd1f577ae7faa7d3'
}, function(err, flickr) {
  err ? console.log(err) : flickr.blogs.getServices(function(err) {
    if (err) {console.log('h ', err);}
  });
})
/*
/////////////////
//THIS WORKS
/////////////////
var request = require('request');
var formQueryObj = require('lib/flickr/generateUploadObj');
var options = { 
  api_key: '45a330b4bcbe145c9b8a7e53dfe21c56',
  secret: 'e175d4c4458c0e0f',
  access_token: '72157647421924547-33f5e8fee2329c42',
  access_token_secret: 'd0e63b4b168ed94d'
}
var fs = require('fs');
//first arg is photo options
var queryObj = formQueryObj({title: 'testx0'}, options);
var photoOptions = queryObj.formData;
//must tack on the photo
photoOptions.photo = fs.createReadStream('./public/img/img008.jpg');
var flickrURL = queryObj.flickrURL;

//THE ACTUAL POST REQUEST
//must attach stuff to the form
var req = request.post(flickrURL, function(error, response, body) {
  // format:json does not actually work, so we need to grab the photo ID from the response XML:
  // <?xml version="1.0" encoding="utf-8" ?>\n<rsp stat="ok">\n<photoid>.........</photoid>\n</rsp>\n
  var data = undefined;
  if(body.indexOf('rsp stat="ok"')>-1) {
    data = parseInt(body.split("<photoid>")[1].split("</photoid>")[0], 10);
  }
});
var form = req.form();
Object.keys(photoOptions).forEach(function(prop) {
  form.append(prop, photoOptions[prop]);
});
//end block
*/