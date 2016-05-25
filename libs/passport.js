/**
 * Created by Jógvan, Mik & Jan on 04/05-2016 14:02.
 */
var JwtStrategy = require('passport-jwt').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
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

    passport.use(new FacebookTokenStrategy({
            clientID: '1584843211828083',
            clientSecret: '2032b359a3d2e5cee45ea7937acef208'
        }, function(accessToken, refreshToken, profile, done) {
            User.findOne({facebookId: profile.id}, function (err, user) {
                if(err){
                    return done(err, null);
                } else if(user){
                    return done(null, user);
                } else{
                    var newUser = new User({
                        username: profile._json.email ? profile._json.email : profile.id,
                        fullname: profile._json.name,
                        facebookId: profile.id
                    });
                    newUser.save(function (err) {
                        return done(err, newUser);
                    });
                }
            });
        }
    ));

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });
};
