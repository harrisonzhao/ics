'use strict';
(require('rootpath')());

var mongoose = require('mongoose');
var passport = require('config/configs').passport;

var User = mongoose.model('User', User);  

//GET /api/v1/users/
exports.getUsers = function(req, res, next) {
  User.find(function (err, users) {
    if (err) {
      next(err);
    } else {
      req.query.perpage = req.query.perpage ? req.query.perpage : Infinity;
      req.query.page = req.query.page ? req.query.page : 1;
      var first = req.query.perpage * (req.query.page - 1);
      first = isNaN(first) ? 0 : first;
      first = first >= users.length ? 
              (users.length - req.query.perpage <= 0 ? 
                0 : users.length - req.query.perpage) : 
              first;
      users = users.slice(first,first + req.query.perpage);
      res.send(users);
    }
  });
};

//GET /api/v1/users/<id>/
exports.getUserById = function(req, res) {
  return User.findById(req.params.id, function (err, user) {
    err ? res.send(404, {message: 'no such user'}) : res.send(user);
  });
};

//POST /api/v1/users/
exports.postUser = function(req, res, next) {
  if (!(req.params.email && req.params.password)) {
    res.send(400, 'missing fields: ' + 
            (req.params.email ? '' : 'email, ') + 
            (req.params.password ? '': 'password'));
  } else {
    User.findOne({'local.email':  req.params.email}, function(err, result) {
      if (err) {
        next(err);
      } else if (result) {
        res.send(400, 'user already exists');
      } else {
        //create user
        var user = new User();
        user.local.email = req.params.email;
        user.local.password = user.generateHash(req.params.password);
        user.save(function (err) { err ? next(err) : res.send(201); });
      }
    });
  }
};

//PUT /api/v1/users/<id>/
exports.updateUser = function(req, res, next) {
  if (!req.user) {
    res.send(400, 'not logged in');
  } else if (!(req.params.id && req.params.email && req.params.password)) {
    res.send(400, 'missing fields: ' + 
            (req.params.id ? '' : 'id, ') +
            (req.params.email ? '' : 'email, ') + 
            (req.params.password ? '': 'password'));
  } else {
    User.findById(req.params.id, function (err, user) {
      user.email = req.params.email;
      user.password = req.params.password;
      user.save(function (err) { err ? next(err) : res.send(user) });
    });
  }
};

//DELETE /api/v1/users/<id>/
exports.deleteUserById = function (req, res, next) {
  if (!req.params.id) {
    res.send(400, 'missing id');
  } else {
    User.findById(req.params.id, function (err, user) {
      user.remove(function (err) { 
        err ? next(err) : res.sendStatus(200);
      });
    });
  }
};

//POST /api/v1/login/ 
exports.loginUser = function(req, res, next) {
  if (!(req.params.email && req.params.password)) {
    res.send(400, 'missing fields: ' + 
            (req.params.email ? '' : 'email, ') + 
            (req.params.password ? '': 'password'));
  } else {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        next(err);
      } else if (!user) {
        res.send(401, 'invalid email/password combination');
      } else {
        res.sendStatus(200);
      }
    })(req, res, next);
  }
}

//POST /api/v1/logout/
exports.logoutUser = function(req, res, next) {
  if (!req.user) {
    next('not logged in!');
  } else {
    req.logout();
    res.sendStatus(200);
  }
}

//  // GET - login user using oAuth
//  exports.getOAuth = function(req, res) {};
//  
//  // POST - direct login with token
//  exports.postOAuth = function(req, res) {};
//  
//  // GET - oAuth redirection endpoint
//  exports.getOAuthCode = function(req, res) {};
//  
//  // GET - list linked providers
//  exports.getProviders = function(req, res) {};
//  
//  // GET - give info of a specific provider
//  exports.getProviderIndex = function(req, res) {};
//  
//  // DELETE - unlink a provider
//  exports.deleteProvider = function(req, res) {};
//  
//  // GET - link new provider to account
//  exports.getOAuthLink = function(req, res) {};
//  
