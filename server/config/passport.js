const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var User = require('../models/userModel');

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            
            if (err) {
                return done(err);
            }
            if(!user) {
                return done(null, false);
            }
            if(!user.validatePassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is saveto the session file store here')
    return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        if(!err) done(null, user);
        else done(err, null);
    })
});


