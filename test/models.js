/*global describe, it*/
var chai = require('chai');
var should = chai.should();
var User = require('../models/User');

describe('User Model', function() {
  it('should create a new user', function(done) {
    
    done();  
  
    //var user = new User({
    //    email: 'alex@gmail.com',
    //    password: 'testing'
    //});
    //user.save(function(err) {
    //  if (err) return done(err);
    //  done();
    //})
  });

  it('should\'t create a user with the unique email', function(done) {
    var user = new User({
        email: 'alex@gmail.com',
        password: 'testing'
    });
    user.save(function(err) {
      if (err) {
        err.code.should.equal(11000);
      }
      done();
    });
  });

  it('should find user by email', function(done) {
    User.findOne({ email: 'alex@gmail.com' }, function(err, user) {
      if (err) {
        return done(err);
      }
      user.email.should.equal('alex@gmail.com');
      done();
    });
  });
  
  it('should delete a user', function(done) {
    User.remove({ email: 'alex@gmail.com' }, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
});
