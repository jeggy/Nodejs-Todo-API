/**
 * Created by Jógvan on 04/05-2016 16:09.
 */

/*
 * GET /api/todo/
 * GET /api/todo/:id
 * POST /api/todo/
 * PUT /api/todo
 * DELETE /api/todo/

 * entry
 * GET /api/entry/
 * GET /api/entry/:id
 * POST /api/entry/
 * PUT /api/entry
 * POST /api/entry/:id -> Body -> archived: boolean
 * DELETE /api/entry/

 * localhost:3000/api/entry/25
 * body: archived = true
 */
var jwt = require('jwt-simple');
var passport = require('passport');
var config = require('../../config/config');

var Todo = require('../models/todo');

// tree module: https://github.com/franck34/mongoose-tree

module.exports = function(app) {

    function check(req, res, cb){
        var token = require('../../libs/get-token')(req.headers);
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
    }

    app.get('/api/todo', passport.authenticate('jwt', { session: false}), function (req, res) {
        check(req, res, function (err, user) {
            if(!err){

                Todo.find({owner: user._id, root: null}, function (err, data) {
                    console.log(data);
                });
                //     if(err){
                //         // TODO: error!
                //     }else {
                //         res.json(data);
                //     }
                // });
            }
        });
    });

    function sortTodos(node) {
        
    }

    app.get('/api/todo/:id', passport.authenticate('jwt', { session: false}), function (req, res){
        check(req, res, function (err, user) {
            if(!err){
                Todo.findOne({user: user._id, _id: req.params.id}, function (err, data) {
                    if(err){
                        // TODO: error!
                    }else {
                        // TODO: if null
                        res.json(data);
                    }
                });
            }
        });
    });

    app.post('/api/todo', passport.authenticate('jwt', { session: false}), function(req, res){
        check(req, res, function (err, user) {
            if(!err){
                //
                var title = req.body.title;
                var date = req.body.date;
                var root = req.body.root;
                var parent = req.body.parent;
                var child = req.body.child;

                var newTodo = new Todo({
                    title: title,
                    date: date,
                    owner: user,
                    root: root,
                    parent: parent,
                    child: child
                });

                newTodo.save(function (err) {
                    if(err){
                        res.send(err);
                    }else{
                        res.json(newTodo);
                    }
                });
            }
        });
    });

    app.put('/api/todo', passport.authenticate('jwt', { session: false}), function(req, res){
        check(req, res, function (err, user) {
            if(!err){
                var id = req.body.id;

                var update = {};
                if(req.body.title){
                    update.title = req.body.title;
                }
                if(req.body.date){
                    update.date = req.body.date;
                }

                Todo.update({_id: id}, {$set: update}, {multi: false}, function (err, effected) {
                    res.send(effected);
                });
            }
        })
    });

    app.delete('/api/todo/:id', passport.authenticate('jwt', { session: false}), function(req, res){
        check(req, res, function (err, user) {
            if(!err){
                Todo.remove({user: user._id, _id: req.params.id}, function (err, data) {
                    res.send(data);
                });
            }
        })
    });
};
