const debug = require('debug')(process.env.APP_NAME);
const express = require('express');
const chalk = require('chalk');
const conf = require('./config/conf');
const initializeDatabases = require('./config/db')(process.env.DB_TYPE, conf.get('dbs'));
const expressConfig = require('./config/express');
const routes = require('./config/routes');

const app = express();

initializeDatabases.then((dbs) => {
  debug(chalk.green(`${process.env.DB_TYPE} Connected !!!`));

  expressConfig(app, conf, dbs);

  routes(app, conf, dbs);
  app.listen(conf.get('port'), () => debug(`Listening on port ${
    chalk.green(conf.get('port'))}`));
})
  .catch((err) => {
    debug(chalk.red('Failed to make all database connections!'));
    debug(err);
    process.exit(1);
  });
