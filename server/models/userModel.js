const crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    googleId: {
        type: String,
        unique: true,
    },
    facebookId: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    familyName: {
        type: String,
    },
    mobile: {
        type: Number,
        required: true,
        min: 10
    },
    role:{
      type:[String],
      required: true,
      default:'user'
    },
    hash: {
        type: String,
    },
    salt: {
        type: String,
    },
    provider: {
        type: String,
        required: true,
        default:'local'
    }
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    console.log("________", password, this.salt);
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
    return hash === this.hash;
};

module.exports = function (connection) {
    return connection.core.model('User', userSchema);;
};