//update accordingly
var obj = {
  mysqlConfigs: {
    host: process.env.MODE==='production' ? 'localhost' : 'infcs.cloudapp.net',
    user: 'ics',
    password: 'suchrekt',
    database: 'infcs',
    supportBigNumbers: 'true'
  },
  sessionSecret: process.env.SESSION_SECRET || 'Custom session secret',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  //inetAddr: 'infcs.cloudapp.net'
  inetAddr: 'localhost:3000'
};

function getExternalIp() {
  require('http').request({
      hostname: 'fugal.net',
      path: '/ip.cgi',
      agent: false
      }, function(res) {
      if(res.statusCode !== 200) {
          throw new Error('non-OK status: ' + res.statusCode);
      }
      res.setEncoding('utf-8');
      var ipAddress = '';
      res.on('data', function(chunk) { ipAddress += chunk; });
      res.on('end', function() {
          // ipAddress contains the external IP address
          console.log('ip address: ' + ipAddress);
          obj.inetAddr = ipAddress;
      });
      }).on('error', function(err) {
      throw err;
  }).end();
}

if (process.env.MODE === 'production') {
  getExternalIp();
}

module.exports = obj;