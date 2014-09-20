var secrets = require('./secrets');

module.exports = {
  service: 'SendGrid',
  host: 'smtp.sendgrid.net',
  port: 587,
  secureConnection: false,
  auth: {
    user: secrets.emailUserName,
    pass: secrets.emailPassword
  },
  ignoreTLS: false,
  debug: false,
  maxConnections: 5
}
