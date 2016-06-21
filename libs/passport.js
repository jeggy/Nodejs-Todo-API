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

    // From the JWT Strategy example: https://www.npmjs.com/package/passport-jwt
    var opts = {
        secretOrKey: config.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, next) {
        User.findOne({userName: jwt_payload.sub}, function (err, user) {
            if (err) {
                return next(err, false);
            }
            if (user) {
                next(null, user);
            } else
                next(null, false, 'User token not found');
        });
    }));

    // Facebook Strategy
    passport.use(new FacebookTokenStrategy({
            // Facebook todo api information
            clientID: '1584843211828083',
            clientSecret: '2032b359a3d2e5cee45ea7937acef208'
        }, function(accessToken, refreshToken, profile, done) {
            // 'profile' is the facebook user object.
            // Find user in DB from facebook id
            User.findOne({facebookId: profile.id}, function (err, user) {
                if(err){
                    return done(err, null);
                } else if(user){
                    // if found return user
                    return done(null, user);
                } else{
                    // if user not found, create new user

                    var newUser = new User({
                        // use email for username or facebook id if access to email wan't provided.
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
