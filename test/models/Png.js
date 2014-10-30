'use strict';

var async = require('async');
var png = require('png/PNGStorage');

function placeholder(callback) {
	var data = png.encode("12345");
  callback(null);
}

describe('png tests', function () {
  it('pnjesus', 
    function(done) {
      async.waterfall(
      [
    		placeholder
      ],
      function (err) {
        (err === null).should.be.true;
        done();
      });
    }
  );
});