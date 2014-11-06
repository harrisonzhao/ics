module.exports = {
  mysqlConfigs: {
    host: 'localhost',
    user: 'ics',
    password: 'suchrekt',
    database: 'infcs',
    supportBigNumbers: 'true'
  },
  sessionSecret: process.env.SESSION_SECRET || 'Custom session secret',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  inetAddr: 'infcs.cloudapp.net'
};
