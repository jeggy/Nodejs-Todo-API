/**
 * Created by Jógvan on 04/05-2016 16:14.
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
    var token = require('./get-token')(req.headers);
    if (token) {
        var user = jwt.decode(token, config.secret);
        if (!user) {
            cb(true, null);
            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // Success
            cb(null, user);
        }
    } else {
        cb(true, null);
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};