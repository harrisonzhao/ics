module.exports = {
  db: process.env.MONGODB || 'mongodb://localhost:27017/nodeStarterApp',
  sessionSecret: process.env.SESSION_SECRET || 'Custom session secret',
  localAuth: true,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  emailUserName: 'user',
  emailPassword: 'password'
};
