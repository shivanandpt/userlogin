
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
                    email: profile.email || profile.emails && profile.emails[0].value,
                    name: profile.name && profile.name.givenName || profile.displayName,
                    familyName: profile.name && profile.name.familyName || "",
                    mobile: "1234567890",
                    provider: "google",
                    verified:true,
                    verifiedAt: new Date().getTime()
                });
                newUser.save(function (err, user) {
                    if (err) return done(err);
                    console.log(user);
                    return done(null, newUser);
                });
              });
          }));
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
                    facebookId: profile.id,
                    email: profile.email || profile.emails && profile.emails[0].value,
                    name: profile.name && profile.name.givenName || profile.displayName,
                    familyName: profile.name && profile.name.familyName || "",
                    mobile: "1234567890",
                    provider: "facebook",
                    verified:true,
                    verifiedAt: new Date().getTime()
                });
                newUser.save(function (err, user) {
                    if (err) return done(err);
                    console.log(user);
                    return done(null, newUser);
                });
              });
          }));
    }

    if (passportStrategy.twitterStrategy &&
        passportStrategy.twitterStrategy == 'twitter') {
        var TwitterStrategy = require('passport-twitter').Strategy;
        passport.use(new TwitterStrategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: "http://localhost:3000/auth/twitter/callback",
            includeEmail: true,
          },
          function(token, tokenSecret, profile, cb) {
              console.log(profile)
              User.findOne({ twitterId: profile.id }, function (err, user) {
                if(err) {
                    return cb(err);
                }
                if (user) {
                    return cb(null, user);
                }
                let newUser = new User({ 
                    twitterId: profile.id,
                    email: profile.email || profile.emails && profile.emails[0].value,
                    name: profile.name && profile.name.givenName || profile.displayName,
                    familyName: profile.name && profile.name.familyName || "",
                    mobile: "1234567890",
                    provider: "twitter",
                    verified:true,
                    verifiedAt: new Date().getTime()
                });
                newUser.save(function (err, user) {
                    if (err) return done(err);
                    console.log(user);
                    return cb(null, newUser);
                });
              });
          }));
    }

    if (passportStrategy.githubStrategy &&
        passportStrategy.githubStrategy == 'github') {
        var GitHubStrategy = require('passport-github2').Strategy;
        passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback",
            scope: 'user:email'
          },
          function(accessToken, refreshToken, profile, done) {
              console.log(profile)
              User.findOne({ githubId: profile.id }, function (err, user) {
                if(err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }
                let newUser = new User({ 
                    githubId: String(profile.id),
                    email: profile.email || profile.emails && profile.emails[0].value,
                    name: profile.name && profile.name.givenName || profile.displayName,
                    familyName: profile.name && profile.name.familyName || "",
                    mobile: "1234567890",
                    provider: "github",
                    verified:true,
                    verifiedAt: new Date().getTime()
                });
                newUser.save(function (err, user) {
                    if (err) return done(err);
                    console.log(user);
                    return done(null, newUser);
                });
              });
          }));
    }

    if (passportStrategy.linkedinStrategy &&
        passportStrategy.linkedinStrategy == 'linkedin') {
        var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
        passport.use(new LinkedInStrategy({
            clientID: process.env.LINKEDIN_KEY,
            clientSecret: process.env.LINKEDIN_SECRET,
            callbackURL: "http://localhost:3000/auth/linkedin/callback",
            scope: ['r_emailaddress', 'r_liteprofile']
          },
          function(accessToken, refreshToken, profile, done) {
              console.log(profile)
              User.findOne({ linkedinId: profile.id }, function (err, user) {
                if(err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }
                let newUser = new User({ 
                    linkedinId: profile.id,
                    email: profile.email || profile.emails && profile.emails[0].value,
                    name: profile.name && profile.name.givenName || profile.displayName,
                    familyName: profile.name && profile.name.familyName || "",
                    mobile: "1234567890",
                    provider: "linkedin",
                    verified:true,
                    verifiedAt: new Date().getTime()
                });
                newUser.save(function (err, user) {
                    if (err) return done(err);
                    console.log(user);
                    return done(null, newUser);
                });
              });
          }));
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


