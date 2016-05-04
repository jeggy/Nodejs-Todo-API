/**
 * Created by Jógvan on 04/05-2016 16:09.
 */

/*
 * GET /api/todo/
 * GET /api/todo/:id
 * POST /api/todo/
 * PUT /api/todo
 * DELETE /api/todo

 * entry
 * GET /api/entry/
 * GET /api/entry/:id
 * POST /api/entry/
 * PUT /api/entry
 * POST /api/entry/:id -> Body -> archived: boolean
 * DELETE /api/entry

 localhost:3000/api/entry/25
 body: archived = true
 */
var jwt = require('jwt-simple');
var passport = require('passport');
var config = require('../../config/config');

var Todo = require('../models/todo');

module.exports = function(app) {

    app.post('/api/todo', passport.authenticate('jwt', { session: false}), function(req, res){
        var token = require('../../libs/get-token')(req.headers);
        if (token) {
            var user = jwt.decode(token, config.secret);
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                //
                var title = req.body.title;
                var date = req.body.date;

                var newTodo = new Todo({
                    title: title,
                    date: date,
                    user: user,
                    entries: []
                });

                newTodo.save(function (err) {
                    if(err){
                        res.send({success: false});
                    }else{
                        res.json(newTodo);
                    }
                });

            }
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }
    });

};