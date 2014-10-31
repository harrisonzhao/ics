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
app.get('/auth/user', auth.checkLoggedIn, auth.getUserInfo);
app.post('/auth/user', auth.signup);
app.delete('/auth/session', auth.checkLoggedIn, auth.logout);
app.post('/auth/session', auth.login);

var fs = require('controllers/filesystem/exports');
app.post('/fs/directory', auth.checkLoggedIn, fs.makeDirectory);
app.get('/fs/directory', auth.checkLoggedIn, fs.getDirectory);
app.post('/fs/upload', auth.checkLoggedIn, fs.createFile);
app.get('/fs/upload', auth.checkLoggedIn, fs.getDownloadFileData);
app.get('/fs/download', auth.checkLoggedIn, fs.getUploadFileData);
//ghetto delete, does not free flickr memory
app.delete('/fs/delete', auth.checkLoggedIn, fs.deleteNode);
//TODO update?


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
var errorHandler = require('controllers/errorHandler').errorHandler;
app.use(errorHandler);
/*app.post('/auth/user', function(req, res) {
  console.log(req.body);
});
app.post('/auth/session', function(req, res) {
  console.log(req.body);
})*/
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
var path = require('path');
app.get('/partials/*', function(req, res) {
  var requestedView = path.join('./', req.url);
  res.render(requestedView);
});

app.get('/*', function(req, res) {
  if(req.user) {
    res.cookie('user', JSON.stringify(req.user.user_info));
  }

  res.render('index.html');
});

app.listen(configs.settings.secrets.port);
console.log('listening on port ' + configs.settings.secrets.port);

/*
/////////////////
//THIS WORKS
/////////////////
var request = require('request');
var uploadQuery = require('lib/flickr/generateSignedQueries').upload;
var options = { 
  api_key: '45a330b4bcbe145c9b8a7e53dfe21c56',
  secret: 'e175d4c4458c0e0f',
  access_token: '72157647421924547-33f5e8fee2329c42',
  access_token_secret: 'd0e63b4b168ed94d'
}
var fs = require('fs');
//first arg is photo options
var queryObj = uploadQuery({
  title: 'fuckingshit1',
  is_public: 0,
  is_friend: 0,
  is_family: 0,
  hidden: '2'
}, options);
var photoOptions = queryObj.formData;
//must tack on the photo
photoOptions.photo = fs.createReadStream('./public/img/hi.png');
var flickrURL = queryObj.flickrURL;

//THE ACTUAL POST REQUEST
//must attach stuff to the form
var req = request.post(flickrURL, function(error, response, body) {
  // format:json does not actually work, so we need to grab the photo ID from the response XML:
  // <?xml version="1.0" encoding="utf-8" ?>\n<rsp stat="ok">\n<photoid>.........</photoid>\n</rsp>\n
  var data;
  if(body.indexOf('rsp stat="ok"')>-1) {
    data = parseInt(body.split("<photoid>")[1].split("</photoid>")[0], 10);
    console.log(data);
  }
  console.log(response);
});
var form = req.form();
Object.keys(photoOptions).forEach(function(prop) {
  form.append(prop, photoOptions[prop]);
});
//end block
*/



//GET IMAGE WITH AUTH STUFF
/*
var request = require('request');
var formQueryObj = require('lib/flickr/generateSignedQueries').getImageSizes;
var options = { 
  api_key: '45a330b4bcbe145c9b8a7e53dfe21c56',
  secret: 'e175d4c4458c0e0f',
  access_token: '72157647421924547-33f5e8fee2329c42',
  access_token_secret: 'd0e63b4b168ed94d'
}
//var fs = require('fs');
//first arg is photo options
var flickrURL = formQueryObj({photo_id: '15315111257'}, options);
//must tack on the photo
//photoOptions.photo = fs.createReadStream('./public/img/img008.jpg');

//THE ACTUAL GET REQUEST
//must attach stuff to the form
request.get(flickrURL, function(error, response, body) {
        if(!response) {
          error = "HTTP Error: no response for url [" + flickrURL + "]";
        }

        if(!body) {
          error = "HTTP Error " + response.statusCode;
          console.log(error);
        }

        // we can transform the error into something more
        // indicative if "errors" is an array of known errors
        // for this specific method call.
        if(!error) {
          try {
            body = body.trim().replace(/^jsonFlickrApi\(/,'').replace(/\}\)$/,'}');
            body = JSON.parse(body);
            if(body.stat !== "ok") {
              return console.log(new Error(body.message));
            }
          } catch (e) {
            return console.log("could not parse body as JSON: " + body);
          }
        }
        console.log(body)
        console.log(body.sizes);
        console.log(body.sizes.size[11]);
        //processResult(false, body);
      });
*/



//auth and uploading with api (server side)
/*
  Flickr.authenticate(tempOptionsStore[req.user.idUser], function(err, flickr) {
    if (err) {
      delete tempOptionsStore[req.user.idUser];
      return next(err); 
    }

    var uploadOptions = {
      photos: [{
        title: 'test2032fasdfdaffafadse',
        photo: __dirname + '/../../public/img/hi.png',
        is_public: 0,
        is_friend: 0,
        is_family: 0,
        hidden: '2'
      }]
    }
    console.log(flickr.options);
    Flickr.upload(uploadOptions, flickr.options, function(err, result) {
      if(err) {
        return console.error(error);
      }
      console.log("photos uploaded", result);
    });
    delete tempOptionsStore[req.user.idUser];
    res.sendStatus(200);
  });
*/

/*
options:
    //secret: 'dd1f577ae7faa7d3',
    //api_key: '2b31b1da603a3d701f173aae3a3337b4',
    //above is wrong matching key
    // api_key: '45a330b4bcbe145c9b8a7e53dfe21c56',
    // secret: 'e175d4c4458c0e0f',
    // access_token: '72157647421924547-33f5e8fee2329c42',
    // access_token_secret: 'd0e63b4b168ed94d',
 */