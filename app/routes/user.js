/**
 * Created by Jógvan on 02/05-2016 20:36.
 */

var User = require('../mongoose').User;

module.exports = function(app) {

    app.post('/api/user', function(req, res) {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });

        newUser.save(function (err) {
            if (!err) {
                return res.status('200').send();
            } else {
                console.log(err);
                if(err.name == 'ValidationError') {
                    res.status(400).send({validation_error: err.errors});
                } else {
                    res.status(500).send({error: 'Server error'});
                }
            }
        });
    });

};