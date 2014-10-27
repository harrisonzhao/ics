/*global describe*/
/*global it*/
'use strict';
(require('rootpath')());

var Nodes = require('models/Nodes');
var async = require('async');

function selectByParentId(callback) {
  Nodes.selectByParentId(1, function(err, result) {
    if (err) { return callback(err); }
    result[0].idNode.should.equal(2);
    result.length.should.equal(1);
    callback(null);
  });
}

function selectByUserId(callback) {
  Nodes.selectByUserId(1, function(err, result) {
    if (err) { return callback(err); }
    result[0].idNode.should.equal(1);
    result.length.should.equal(1);
    callback(null);
  });
}

function selectByChildId(callback) {
  Nodes.selectByChildId(1, function(err, result) {
    if (err) { return callback(err); }
    (result.idParent == null).should.be.true;
    callback(null);
  });
}

describe('Nodes model', function () {
  it('nodes tests', 
    function(done) {
      async.waterfall(
      [
        selectByParentId,
        selectByUserId,
        selectByChildId
      ],
      function (err) {
        if (err) { console.log(err); }
        (err === null).should.be.true;
        done();
      });
    }
  );
});