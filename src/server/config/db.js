const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
var mysql = require('mysql');

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


var connectMySql = function (db) {

    return new Promise((resolve, reject) =>{

        var connection = mysql.createConnection({
            host     : db.host,
            user     : db.user,
            password : db.password,
            database : db.name
        });
        connection.connect(function(err) {
            if (err) {
              console.error('error connecting: ' + err.stack);
              return reject(err);
            }
            return resolve(connection);
          });
    });
};

module.exports = async function(dbType, conf){

    let dataBases
    switch (dbType) {
        case "Mongodb":
            conf = conf.map(x => connectMongodb(createuDbUrl(x), x));
            dataBases =  await Promise.all(conf);
            break;

        case "MySql":
            conf = conf.map(x => connectMySql(x));
            dataBases =  await Promise.all(conf);
            break;

        default:
            conf = conf.map(x => connectMongodb(createuDbUrl(x), x));
            dataBases =  await Promise.all(conf);
            break;
    }

    return { 
        core: dataBases[0],
        login: dataBases[1],
        user: dataBases[2]
    };
};