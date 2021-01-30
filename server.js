const conf = require('./server/config/conf');
const initializeDatabases = require('./server/config/db')
(process.env.DB_TYPE, conf.get("dbs"));
const express = require('express')
const app = express();

initializeDatabases.then(dbs => {
    console.log(process.env.DB_TYPE + " Connected !!!");
    require('./server/config/express')(app, conf, dbs);
    require('./server/config/routes')(app, conf, dbs);

    app.listen(conf.get("port"),() => console.log('Listening on port ' +
    conf.get("port")));
})
.catch(err => {
    console.error('Failed to make all database connections!')
    console.error(err)
    process.exit(1)
});