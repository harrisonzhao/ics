var mysql = require('mysql');
var settings = require('./settings/exports');

//set up mysql connection
var connection = mysql.createConnection(settings.secrets.mysqlConfigs);
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected as id ' + connection.threadId);
  }
});

module.exports = connection;