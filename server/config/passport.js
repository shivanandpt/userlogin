
module.exports = function (conf, dbs) {
    
    const passport = require('passport');
    const passportStrategy = conf.get("passportStrategy");
    var User = require('../models/userModel')(dbs);

    if (passportStrategy.localStrategy &&
        passportStrategy.localStrategy == 'local') {
        const LocalStrategy = require('passport-local').Strategy;
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
    }

    if (passportStrategy.googleStrategy &&
        passportStrategy.googleStrategy == 'google') {
        var GoogleStrategy = require('passport-google-oauth2').Strategy;
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: passportStrategy.googleStrategyCallbackUrl,
            passReqToCallback: true
          },
          function(request, accessToken, refreshToken, profile, done) {
              User.findOne({ googleId: profile.id }, function (err, user) {
                if(err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }
                let newUser = new User({ 
                    googleId: profile.id,
                    email: profile.email,
                    name: profile.name.givenName,
                    familyName: profile.name.familyName,
                    mobile: "1234567890",
                    provider: "google"
                });
                newUser.save(function (err, user) {
                    if (err) return done(err);
                    console.log(user);
                    return done(null, newUser);
                })
                
              });
          }
        ));
    }
    if (passportStrategy.facebookStrategy &&
        passportStrategy.facebookStrategy == 'facebook') {
        var FacebookStrategy = require('passport-facebook').Strategy;
        passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: passportStrategy.facebookStrategyCallbackUrl,
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
          },
          function(accessToken, refreshToken, profile, done) {
              console.log(profile)
              User.findOne({ facebookId: profile.id }, function (err, user) {
                if(err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }
                let newUser = new User({ 
                    facebookId: String(profile.id),
                    email: profile.email || profile.emails[0].value,
                    name: profile.name.givenName || profile.displayName ,
                    familyName: profile.name.familyName || "",
                    mobile: "1234567890",
                    provider: "facebook"
                });
                newUser.save(function (err, user) {
                    if (err) return done(err);
                    console.log(user);
                    return done(null, newUser);
                })
                
              });
          }
        ));
    }
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
}


