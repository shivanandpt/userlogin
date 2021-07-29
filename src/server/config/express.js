
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const path = require('path');
const express = require('express');
const util = require('./util');
const passportConf = require('./passport')

module.exports = function (app, conf, db) {
  
  console.log(path.join(conf.get('rootPath') +'public'))
  app.use(express.static(path.join(conf.get('rootPath') +'public')))
  app.use(session(util.setSessionConfig(conf, session, db)));
  app.use(passport.initialize());
  app.use(passport.session());
  passportConf(conf, db);
  app.use(morgan('dev'));
 
};