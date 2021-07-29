
module.exports = function (app, conf, db) {

    const passport = require('passport');
    
    //Models are created
    var User = require('../models/userModel')(db);

    //Routes for model are created
    var userRoutes = require('../routes/userRoutes')(User);

    //Routes are assigned to app and created
   
    // create the login get and post routes
  
    const passportStrategy = conf.get("passportStrategy");

    if (passportStrategy.localStrategy &&
        passportStrategy.localStrategy == 'local') {
        app.post('auth/login', passport.authenticate('local', { failureRedirect: '/auth/login' }),
        function(req, res) {
            res.redirect('/home');
        });
    }
    if (passportStrategy.googleStrategy &&
        passportStrategy.googleStrategy == 'google') {
        app.get('/auth/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }));
        app.get('/auth/google/callback',passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/login',
            scope: [ 'profile', 'email' ] 
        }));
    }
    if (passportStrategy.facebookStrategy &&
        passportStrategy.facebookStrategy == 'facebook') {
        app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
        app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/login',
            scope: ['email']
        }));
    }
    if (passportStrategy.twitterStrategy &&
        passportStrategy.twitterStrategy == 'twitter') {
        app.get('/auth/twitter', passport.authenticate('twitter'));
        app.get('/auth/twitter/callback', passport.authenticate('twitter', {
            successRedirect: '/home',
            failureRedirect: '/login'
        }));
    }
    if (passportStrategy.githubStrategy &&
        passportStrategy.githubStrategy == 'github') {
        app.get('/auth/github', passport.authenticate('github'));
        app.get('/auth/github/callback', passport.authenticate('github', {
            successRedirect: '/home',
            failureRedirect: '/login'
        }));
    }
    if (passportStrategy.linkedinStrategy &&
        passportStrategy.linkedinStrategy == 'linkedin') {
        app.get('/auth/linkedin', passport.authenticate('linkedin'));
        app.get('/auth/linkedin/callback',passport.authenticate('linkedin', {
            successRedirect: '/home',
            failureRedirect: '/login'
        })); 
    }
  
    app.get('/home', (req, res) => {
        console.log('Inside GET /login callback function')
        console.log(req.sessionID)
        res.send(`You got the login page!\n`)
    });

    app.get('/', (req, res) => {
        console.log("2 sesssionID ", req.sessionID);
        res.send('you just hit the home page' + req.sessionID);
    });
    app.use('/user', userRoutes);

 
    app.use(function (err, req, res, next) {
        
        res.status(err.status || 500);
        res.send({
            success: false,
            message: err.message,
            error: err
        });
    });

    // app.post('/login',(req, res) => {
    //     console.log('Inside POST /login callback function');
    //     passport.authenticate('local', (err, user, info) => {
    //         console.log('Inside passport.authenticate() callback');
    //         console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
    //         console.log(`req.user: ${JSON.stringify(req.user)}`);
    //         req.login(user, (err) =>{
    //             console.log('Inside req.login() callback')
    //         console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    //         console.log(`req.user: ${JSON.stringify(req.user)}`)
    //         return res.send('You were authenticated & logged in!\n');
    //         })
    //     })
       
    //     console.log(req.body)
    //     res.send(`You posted to the login page!\n`)
    // })
   

    /*   // Get all paths starting with partials and replace them with /public/app + given folder and file
      app.get('/partials/*', function (req, res) {
          console.log(req.params);
          res.render('../../public/app/' + req.params[0]);
      });
  
      // all path other than defined paths are redirected to landing page
      app.get('*', function (req, res) {
          res.render('index');
      });
  
      app.use(function (req, res, next) {
          var err = new Error('Not Found');
          err.status = 404;
          next(err);
      });
  
      app.use(function (err, req, res, next) {
          if (err.name === 'UnauthorizedError') {
              res.status(401);
              res.json({ "message": err.name + ": " + err.message });
          }
      });
  
      if (app.get('env') === 'development') {
          app.use(function (err, req, res, next) {
              res.status(err.status || 500);
              res.render('error', {
                  message: err.message,
                  error: err
              });
          });
      }
      app.use(function (err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
              message: err.message,
              error: {}
          });
      });
   */
}