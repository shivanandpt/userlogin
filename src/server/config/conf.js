const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('conf');
const convict = require('convict');
const dotenv = require('dotenv').config();
debug(process.env.DB_TYPE);
const schema = require('./convictSchema/schema');
var rootPath = path.normalize(__dirname + "../../../");

var conf = convict(schema);
var env = conf.get('env');
conf.loadFile(rootPath + "/server/config/configFiles/" + env + ".json");
conf.validate({ strict: true });
conf.load({
    rootPath: rootPath
});
debug(chalk.green("conf loaded !!!"));
module.exports = conf;