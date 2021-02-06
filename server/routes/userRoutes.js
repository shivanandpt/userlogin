
const express = require('express');
const utils = require('../utils');
var routes = function (User) {

    var userRouter = express.Router();
    var userController = require('./../controllers/userContoller')(User);

    userRouter.use('/signup', userController.chekIfEmailPresent);
    userRouter.route('/signup')
    .post(userController.post, (req, res) => res.send(utils.createSuccessResponse(req.data)));

    userRouter.route('/:userId')
    .get(userController.getUserById, (req, res) => res.send(utils.createSuccessResponse(req.data)));

    // userRouter.get('/getUserList', function (req ,res, next) {
    //     User.find(function (err, users) {
    //         if (err) return console.error(err);
    //         console.log(users.map(x => x.name));
    //         return res.send(users.map(x => x.name));
    //     })
    // });

    // userRouter.post('/createUser', function (req ,res, next) {
    //     let user = new User(req.body);
    //     user.setPassword(req.body.password);
    //     user.save(function (err, user) {
    //         if (err) return console.error(err);
    //         console.log(user);
    //         return res.send(user);
    //     })
    // })

    return userRouter;
};

module.exports = routes;