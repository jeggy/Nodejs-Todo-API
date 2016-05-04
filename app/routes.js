/**
 * Created by Jógvan on 02/05-2016 19:01.
 */
var jwt = require('jwt-simple');
var passport = require('passport');
var User = require('./models/user');
var config = require('../config/config');

module.exports = function(app){

    require('./routes/user')(app);
    require('./routes/todo')(app);

    app.get('/', function (req, res) {
        res.send("Hello World!");
    });


    app.post('/register', function(req, res) {
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
                res.json({success: true, msg: 'Successful created new user.'});
            });
        }
    });


    app.post('/authenticate', function(req, res) {
        User.findOne({
            username: req.body.username
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                // check if password matches
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        var token = jwt.encode(user, config.secret);
                        // return the information including token as JSON
                        res.json({success: true, token: 'JWT ' + token});
                    } else {
                        res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                    }
                });
            }
        });
    });


    app.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
        var token = require('../libs/get-token')(req.headers);
        if (token) {
            var user = jwt.decode(token, config.secret);

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, msg: 'Welcome in the member area ' + user.fullname + '!'});
            }
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }
    });
};



