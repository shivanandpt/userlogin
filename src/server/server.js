const debug = require('debug')(process.env.APP_NAME);
const express = require('express');
const chalk = require('chalk');
const conf = require('./config/conf');
const initializeDatabase = require('./config/db')(conf.get('db'));
const expressConfig = require('./config/express');
const routes = require('./config/routes');

const app = express();

initializeDatabase
  .then((db) => {
    debug(chalk.green(`${process.env.DB_TYPE} Connected !!!`));

    expressConfig(app, conf, db);
    routes(app, conf, db);
    app.listen(conf.get('port'), () => debug(`Listening on port ${chalk.green(conf.get('port'))}`));
  })
  .catch((err) => {
    debug(chalk.red('Failed to make all database connections!'));
    debug(err);
    process.exit(1);
  });
