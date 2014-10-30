module.exports = {
  mysqlConfigs: {
    host: 'infcs.cloudapp.net',
    user: 'ics',
    password: 'suchrekt',
    database: 'infcs',
    supportBigNumbers: 'true'
  },
  sessionSecret: process.env.SESSION_SECRET || 'Custom session secret',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000
};
