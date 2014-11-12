//file used to load other routes
'use strict';
(require('rootpath')());

var express = require('express');
var app = module.exports = express();
var configs = require('config/configs');
configs.configure(app);

//endpoints:
//==========
var api = require('routes/api');
api(app);

var index = require('routes/index');
index(app);

app.listen(configs.settings.secrets.port);
console.log('listening on port ' + configs.settings.secrets.port);