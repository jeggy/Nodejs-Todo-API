/**
 * Created by Jógvan, Mik & Jan on 04/05-2016 16:14.
 */
var jwt = require('jwt-simple');
var config = require('../config/config');

module.exports = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports.check = function (req, res, cb){
    // Check provided authentication token
    var token = require('./get-token')(req.headers);
    if (token) { // if valid token
        if(req.headers.authorization.substr(0,3) == 'JWT') {
            var user = jwt.decode(token, config.secret);
            if (!user) {
                var errmsg = {success: false, msg: 'Authentication failed. User not found.'};
                cb(errmsg, null);
                return res.status(401).send(errmsg);
            } else {
                // Success
                cb(null, user);
            }
        }else{
            // TODO: have some extra check for it having Bearier in token.
            // Facebook
            console.log("Hello");
            cb(null, req.user);
        }
    } else {
        errmsg = {success: false, msg: 'No token provided.'};
        cb(errmsg, null);
        return res.status(401).send(errmsg);
    }

    // TODO: maybe add another return 401 here.
};