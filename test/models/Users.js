/*global describe*/
/*global it*/
'use strict';
(require('rootpath')());

var Users = require('models/Users');
var async = require('async');

var testUser = {
  apiKey: '1234567890123456789012345678901',
  apiKeySecret: '123456789012345',
  email: 'atest',
  firstName: 'test',
  lastName: 'test',
  passwordHash: 'thehash'
};

function create(callback) {
  Users.create(
    testUser.apiKey,
    testUser.apiKeySecret,
    testUser.email,
    testUser.firstName,
    testUser.lastName,
    testUser.passwordHash,
    function(err, result) {
      if(err) {return callback(err); }
      result.should.not.equal(null);
      testUser.idUser = result;
      callback(null);
    })
}

function selectById(callback) {
  Users.selectById(testUser.idUser, function(err, result) {
    if (err) { return callback(err); }
    result.idUser.should.equal(testUser.idUser);
    callback(null);
  });
}

function deleteUser(callback) {
  Users.deleteById(testUser.idUser, callback);
}

describe('Users model', function () {
  it('should work', 
    function(done) {
      async.waterfall(
      [
        create,
        selectById,
        deleteUser
      ],
      function (err) {
        if (err) { console.log(err); }
        (err === null).should.be.true;
        done();
      });
    }
  );
});