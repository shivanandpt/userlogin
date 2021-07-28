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
    twitterId: {
        type: String,
        unique: true,
    },
    githubId: {
        type: String,
        unique: true,
    },
    linkedinId: {
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
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    verifiedAt : {
        type: Number
    }
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
    return hash === this.hash;
};

userSchema.method.getName = function () {
    return this.name;
};

userSchema.method.getEmail = function () {
    return this.email;
};

userSchema.method.userVerified = function () {
    return this.verified;
};

userSchema.method.getFullName = function () {
    return this.name + " " + this.familyName;
};

userSchema.method.getUserPorfile = function () {
    return {
        email: this.email,
        name: this.name,
        mobile: this.mobile,
        familyName: this.familyName,
        verified: this.verified
    };
};


module.exports = function (connection) {
    return connection.core.model('User', userSchema);;
};