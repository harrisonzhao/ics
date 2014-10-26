/*global describe*/
/*global it*/
'use strict';

var async = require('async');

function add(callback) {
  var result = 1 + 1;
  result.should.equal(2);
  callback(null);
}

function subtract(callback) {
  var result = 1 - 1;
  result.should.equal(0);
  callback(null);
}

describe('initial tests', function () {
  it('should work', 
    function(done) {
      async.waterfall(
      [
        add,
        subtract
      ],
      function (err) {
        (err === null).should.be.true;
        done();
      });
    }
  );
});