/*global it*/
var request = require('supertest'),
    app = require('../app.js'),

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});
