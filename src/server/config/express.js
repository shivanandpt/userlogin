const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const util = require('./util');

module.exports = function (app, conf, db) {
  require('./passport')(conf, db);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session(util.setSessionConfig(conf, session, db)));
  app.use(passport.initialize());
  app.use(passport.session());
};