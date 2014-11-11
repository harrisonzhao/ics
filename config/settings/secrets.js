function getExternalIp() {
  var ifconfig = require('os').networkInterfaces();
  var device, i, I, protocol;
 
  for (device in ifconfig) {
    // ignore network loopback interface
    if (device.indexOf('lo') !== -1 || !ifconfig.hasOwnProperty(device)) {
      continue;
    }
    for (i=0, I=ifconfig[device].length; i<I; i++) {
      protocol = ifconfig[device][i];
 
      // filter for external IPv4 addresses
      if (protocol.family === 'IPv4' && protocol.internal === false) {
        console.log('inet address: ', protocol.address);
        return protocol.address;
      }
    }
  }
 
  return null;
}

//update accordingly
module.exports = {
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
  inetAddr: process.env.MODE==='production' ? getExternalIp() :'localhost:3000'
};
