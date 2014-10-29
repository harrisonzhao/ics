/*global describe*/
/*global it*/
'use strict';
(require('rootpath')());

var Nodes = require('models/Nodes');
var async = require('async');

function selectByParentId(callback) {
  Nodes.selectByParentId(1, 1, function(err, result) {
    if (err) { return callback(err); }
    result[0].idNode.should.equal(2);
    result.length.should.equal(1);
    callback(null);
  });
}

function selectByParentIdNull(callback) {
  Nodes.selectByParentId(null, 1, function(err, result) {
    if (err) { return callback(err); }
    result[0].idNode.should.equal(1);
    result.length.should.equal(1);
    callback(null);
  });
}

function selectByChildId(callback) {
  Nodes.selectByChildId(1, 1, function(err, result) {
    if (err) { return callback(err); }
    (result.idParent == null).should.be.true;
    callback(null);
  });
}

function insertDirectory(callback) {
	Nodes.insertDirectory(1,1,'unittest', function(err, result){
		if (err) { return callback(err); }
		(result > 0).should.be.true;
		callback(null);
	});
}

describe('Nodes model', function () {
  it('nodes tests', 
    function(done) {
      async.waterfall(
      [
        selectByParentId,
        selectByParentIdNull,
        selectByChildId,
        insertDirectory
      ],
      function (err) {
        if (err) { console.log(err); }
        (err === null).should.be.true;
        done();
      });
    }
  );
});