
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

/*app.post('/auth/user', function(req, res) {
  console.log(req.body);
});
app.post('/auth/session', function(req, res) {
  console.log(req.body);
})*/
/*var flickrAuth = require('./controllers/flickrAuth/auth');
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
*/

// app.all('*', auth.checkLoggedIn);
// app.get('/profile', staticPages.renderProfile);

// app.get('*', staticPages.serve404);
// 
// var loadBase64Image = function (url, callback) {
//   // Required 'request' module
//   var request = require('request');

//   // Make request to our image url
//   request({url: url, encoding:'base64'}, function (err, res, body) {
//     if (!err && res.statusCode == 200) {
//       // So as encoding set to null then request body became Buffer object
//       var base64prefix = 'data:' + res.headers['content-type'] + ';base64,';
//       if (typeof callback == 'function') {
//           callback(body, base64prefix);
//       }
//     } else {
//       throw new Error('Can not download image');
//     }
//   });
// };

// var noiseUrl = 'https://farm6.staticflickr.com/5599/15503191910_23af3cf817_o.png';
// loadBase64Image(noiseUrl, function(image, prefix) {
//   console.log(prefix + image);
// });
//var request = require('request');
//var fs = require('fs');
/*
app.get('/data', function(req, res) {
  var noiseUrl = 'https://farm6.staticflickr.com/5599/15503191910_23af3cf817_o.png';
  request.get(noiseUrl).pipe(res);
});*/

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
console.log(queryObj);
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
console.log(form)
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
console.log(flickrURL);
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
