'use strict';

var errorHandler = function (err, req, res, next) {
  console.log(err);
  console.log(err.stack);
  console.trace();
  res.send(400, err.message);
}

exports.errorHandler = errorHandler;