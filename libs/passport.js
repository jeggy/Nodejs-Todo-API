/**
 * Created by Jógvan on 04/05-2016 14:02.
 */
var JwtStrategy = require('passport-jwt').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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

    passport.use(new FacebookStrategy({
            clientID: '1584843211828083',
            clientSecret: '2032b359a3d2e5cee45ea7937acef208',
            callbackURL: "http://localhost:3000/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            console.log(accessToken);
            console.log(refreshToken);
            console.log(profile);
            return cb(null, profile);
        }
    ));

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });
};
