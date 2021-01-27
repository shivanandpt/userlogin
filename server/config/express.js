const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const util = require('./util');

module.exports = function (app, conf, dbs) {
  require('./passport');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session(util.setSessionConfig(conf, session, dbs)));
  app.use(passport.initialize());
  app.use(passport.session());
};