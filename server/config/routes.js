
module.exports = function (app, dbs) {

    const passport = require('passport');
    
    //Models are created
    var User = require('../models/userModel')(dbs);

    //Routes for model are created
    var userRoutes = require('../routes/userRoutes')(User);

    //Routes are assigned to app and created
   
    // create the login get and post routes
    app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

    app.get('/login/google', 
    passport.authenticate('google', { scope:
        [ 'profile', 'email' ] }),
    function(req, res) {
        console.log("response ", res);
        res.redirect('/');
    });
    app.get('/login', (req, res) => {
        console.log('Inside GET /login callback function')
        console.log(req.sessionID)
        res.send(`You got the login page!\n`)
    });
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/login',
                                      failureRedirect: '/login', 
                                      scope: ['email']} ));
    app.get('/',   
    // passport.authenticate('google', { scope:
    //     [ 'profile', 'email' ] }),
        (req, res) => {
        console.log("2 sesssionID ", req.sessionID);
        res.send('you just hit the home page' + req.sessionID);
    });
    app.use('/user', userRoutes);


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