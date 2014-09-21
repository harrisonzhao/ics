module.exports = {
  mysqlConfigs: {
    host: 'us-cdbr-azure-east-a.cloudapp.net',
    user: 'b522e363b6ec6a',
    password: 'c4e9977f',
    database: 'infcsAlQ0HlL9eeC'
  },
  sessionSecret: process.env.SESSION_SECRET || 'Custom session secret',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000
};
