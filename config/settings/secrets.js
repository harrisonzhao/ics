module.exports = {
  mysqlConfigs: {
    host     : 'host',
    user     : 'user',
    password : 'pass'
  },
  sessionSecret: process.env.SESSION_SECRET || 'Custom session secret',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000
};
