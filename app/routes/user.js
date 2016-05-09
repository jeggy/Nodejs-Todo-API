/**
 * Created by Jógvan on 02/05-2016 20:36.
 */

var jwt = require('jwt-simple');
var passport = require('passport');
var config = require('../../config/config');
var tokenCheck = require('../../libs/get-token').check;
var User = require('../models/user');

module.exports = function(app) {

    /**
     * @api {post} /api/user/register Register new user
     * @apiVersion 1.0.0
     * @apiName Register
     * @apiGroup User
     *
     * @apiParam {String} username Username
     * @apiParam {String} password Password
     * @apiParam {String} [fullname] Fullname
     * @apiParam {Integer} [age] Age
     *
     * @apiSuccess {Boolean} success The success rate.
     * @apiSuccess {String} msg Information about what went wrong/right.
     *
     * @apiSuccessExample Success-Response:
     *  {
     *    "success": true,
     *    "msg": "Successful created new user."
     *  }
     *
     * @apiError MissingInfo Username and/or password is missing.
     * @apiError UsernameTaken Username already exists.
     *
     */
    app.post('/api/user/register', function(req, res) {
        if (!req.body.username || !req.body.password) {
            res.json({success: false, msg: 'Username and/or password is missing.'});
        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password,
                fullname: req.body.fullname,
                age: req.body.age
            });
            // save the user
            newUser.save(function(err) {
                if (err) {
                    return res.json({success: false, msg: 'Username already exists.'});
                }
                res.json({success: true, msg: 'Successfully created new user.'});
            });
        }
    });

    /**
     * @api {post} /api/user/login User login
     * @apiVersion 1.0.0
     * @apiName Login
     * @apiGroup User
     *
     * @apiParam {String} username Username
     * @apiParam {String} password Password
     * @apiParamExample {application/x-www-form-urlencoded} Request Param Example:
     *      username=jeggy&password=thePassword
     *
     * @apiSuccess {Boolean} success The success rate.
     * @apiSuccess {String} token The token to be used with other api requests.
     *
     * @apiSuccessExample Success-Response:
     *  {
     *     "success": true,
     *     "token": "JWT eyJ0eXAiOiJKV1QiLCfewafsIUzI1NiJ9.eyJfaWQiOiI1NzI5ZjE5NjM2MGIzMTExMTczMjBkMjciLCJ1c2VybmFtZSI6ImplZ2d5IiwicGFzc3dvcmQiOiIkMmEkMTAkcFBqMDVrS1NHVEJRMW1vckxYZWaf34U2IzM1dMWjlreVNZbmpnQlVKQ3EiLCvdbmFtZSI6IkrDs2d2YW4gT2xzZW4iLCJhZ2UiOjIxLCJfX3YiOjB9.i0L5TYHgdYnFRGe_BEq71C4efc2FcrOGQorw_CQdm42"
     *  }
     *
     */
    app.post('/api/user/login', function(req, res) {
        if(req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password')) {
            User.findOne({username: req.body.username}, function (err, user) {
                if (err) throw err;

                var userErrMsg = {success: false, msg: 'Authentication failed. Wrong Username or Password'};

                if (!user) {
                    res.send(userErrMsg);
                } else {
                    // check if password matches
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            // if user is found and password is right create a token
                            var token = jwt.encode(user, config.secret);
                            // return the information including token as JSON
                            res.json({success: true, token: 'JWT ' + token});
                        } else {
                            res.send(userErrMsg);
                        }
                    });
                }
            });
        }else{
            res.send({success: false, msg: 'Authentication failed. Please specify a username and password in your http request body.'});
        }
    });

    /**
     * @api {get} /api/user Get user info
     * @apiVersion 1.0.0
     * @apiName GetUserInfo
     * @apiGroup User
     *
     * @apiHeader {String} authorization Authorization value
     *
     * @apiSuccess {String} _id Id for the logged in user.
     * @apiSuccess {String} username The username
     * @apiSuccess {String} [fullname] User's fullname
     * @apiSuccess {Integer} [age] a The age of the user
     *
     * @apiSuccessExample Success-Response:
     *  {
     *    "_id": "5729f196360b311117320d27",
     *    "username": "jeggy",
     *    "age": 21
     *  }
     *
     * @apiError MissingToken No token provided.
     * @apiError WrongToken Authentication failed. User not found.
     *
     */
    app.get('/api/user', passport.authenticate('jwt', { session: false}), function (req, res) {
        tokenCheck(req, res, function (err, user) {
            User.findOne({_id: user._id}, {password: false, __v: false}, function (err, user) {
                res.send(user);
            });
        });
    });

};