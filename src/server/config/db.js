const mongoose = require('mongoose');

var createuDbUrl = db => "mongodb://" + db.host + ":" + db.port + "/";

var connectMongodb = function (url, db) {

    let options = {
        bufferCommands: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: process.env.NODE_ENV == "development"? true : false,
        poolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
        dbName: db.name
    };
    if(process.env.NODE_ENV != "development") {
        options.pass = db.password;
        options.user = db.user;
        options.dbName = db.password;
        options.authSource = db.authSource;
    }

    return mongoose.createConnection(url, options)
};

module.exports = async function(conf){

    let db;
    db =  await connectMongodb(createuDbUrl(conf),conf);
    return db;
};