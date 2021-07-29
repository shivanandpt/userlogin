const { v4: uuidv4 } = require('uuid');

var setSessionConfig = function (conf, session, db) {

    let sessionConfig = {
        genid: (req) => { //The function is given req as the first argument
            console.log("insid middleware \n session id " + req.sessionID);
            return uuidv4();
        },
        secret: "test",
        resave: false,
        saveUninitialized: true,
        maxAge: conf.get("sessions.maxAge")
    };

    if (conf.get("sessions.store") == "filestore") {
        const FileStore = require('session-file-store')(session);
        var fileStoreOptions = {};
        sessionConfig.store = new FileStore(fileStoreOptions)
    } else {
        const MongoStore = require('connect-mongo')(session);
        sessionConfig.store = new MongoStore({ mongooseConnection: db });
    }
    return sessionConfig;
};

module.exports.setSessionConfig = setSessionConfig;