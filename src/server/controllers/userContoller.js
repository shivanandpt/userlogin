var util = require('./../utils');
var userController = function (User) {
	
	var post = function (req, res, next) {
        var user = new User(req.body);
        user.setPassword(req.body.password);
        user.save(function (err, user) {
            if (err) {
                console.error(err)
                return next(util.createErrorResonse(500, "DB error"));
            } 
            req.data = {
                msg: `User created with email ${ user.email }`, 
                data: []
            };
            return next()
        });
	};

	var getUserById = function (req, res, next) {
		
        User.findById(req.params.userId,
            ['email', 'name', 'familyName', 'mobile', '-_id'],
            function (err, user) {

            if (err) {
                console.error(err)
                return next(util.createErrorResonse(500, "DB error"));
            }
            if (!user) {
                return next(util.createErrorResonse(400, "User not found"));
            }
            req.data = { data: user } ;
            return next();
        })
    };

    var chekIfEmailPresent = function (req, res, next) {
		
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
                console.error(err)
                return res.send.status(500).send(err);
            }
            if (user) {
                req.emailPresent = true;
                return next(util.createErrorResonse(404, "User email alredy present. Use another email"));
            } else {
                req.emailPresent = false;
                return next();
            }
        });
    };

	return{
		post:post,
        getUserById:getUserById,
        chekIfEmailPresent: chekIfEmailPresent
	};
}

module.exports = userController