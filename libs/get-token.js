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
            var errmsg = {success: false, msg: 'Authentication failed. User not found.'};
            cb(errmsg, null);
            return res.status(401).send(errmsg);
        } else {
            // Success
            cb(null, user);
        }
    } else {
        errmsg = {success: false, msg: 'No token provided.'};
        cb(errmsg, null);
        return res.status(401).send(errmsg);
    }
};