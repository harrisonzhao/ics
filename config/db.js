var mysql = require('mysql');
var settings = require('./settings/exports');

//set up mysql connection
var connection = mysql.createConnection(settings.secrets.mysqlConfigs);
var del = connection._protocol._delegateError;
connection._protocol._delegateError = function(err, sequence){
  if (err.fatal) {
    console.trace('fatal error: ' + err.message);
  }
  return del.call(this, err, sequence);
};
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected as id ' + connection.threadId);
  }
});

module.exports = connection;