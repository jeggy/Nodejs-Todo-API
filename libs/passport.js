/**
 * Created by Jógvan on 04/05-2016 14:02.
 */
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jwt-simple');
var config = require('../config/config');

var User = require('../app/models/user');


module.exports = function (passport) {
    var opts = {};

    opts.secretOrKey = config.secret;
    // opts.issuer = config.issuer;
    // opts.audience = config.audience;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({userName: jwt_payload.sub}, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            }
            else done(null, false, 'User token not found');
        });
    }));
};
