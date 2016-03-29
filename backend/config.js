
  var config = {
    port: process.env.PORT,
    APP_URL: process.env.APP_URL,
    MONGOLAB_URI: process.env.MONGOLAB_URI,
    MAILGUN_API: process.env.MAILGUN_API,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    EMAIL_FROM: 'taylor@taylorackley.com'
  };
module.exports = config;
