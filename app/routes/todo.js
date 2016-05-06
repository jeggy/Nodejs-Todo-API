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

    /**
     * @api {get} /api/todo Get's all todo's from logged in user.
     * @apiVersion 1.0.0
     * @apiName GetTodos
     * @apiGroup Todo
     *
     * @apiHeader {String} authorization Authorization value
     *
     * @apiSuccess {Object[]} Todo[] all todos and todos childs.
     *
     * @apiSuccessExample Success-Response:
     *     {
     *       [
     *         {
     *           "_id": "572c5f17e2cce1e442ff1c9c",
     *           "title": "Root!",
     *           "owner": "5729fec3b2102fdd1dd53a32",
     *           "__v": 2,
     *           "child": [
     *             {
     *               "_id": "572c5f930b63dee544e1eabf",
     *               "title": "Parent2!",
     *               "owner": "5729fec3b2102fdd1dd53a32",
     *               "__v": 2,
     *               "child": [
     *                 {
     *                   "_id": "572c5fad5993c09c451c31a2",
     *                   "title": "Child4!",
     *                   "owner": "5729fec3b2102fdd1dd53a32",
     *                   "__v": 1,
     *                   "child": [
     *                     {
     *                       "_id": "572c5fbb841f2a684698de1e",
     *                       "title": "Super Child!",
     *                       "owner": "5729fec3b2102fdd1dd53a32",
     *                       "__v": 0,
     *                       "child": [],
     *                       "parent": "572c5fad5993c09c451c31a2",
     *                       "root": "572c5f17e2cce1e442ff1c9c",
     *                       "archived": false,
     *                       "date": "2016-05-06T09:11:23.704Z"
     *                     }
     *                   ],
     *                   "parent": "572c5f930b63dee544e1eabf",
     *                   "root": "572c5f17e2cce1e442ff1c9c",
     *                   "archived": false,
     *                   "date": "2016-05-06T09:11:09.090Z"
     *                 }
     *               ],
     *               "parent": "572c5f17e2cce1e442ff1c9c",
     *               "root": "572c5f17e2cce1e442ff1c9c",
     *               "archived": false,
     *               "date": "2016-05-06T09:10:43.367Z"
     *             }
     *           ],
     *           "parent": null,
     *           "root": null,
     *           "archived": false,
     *           "date": "2016-05-06T09:08:39.732Z"
     *         },
     *         {
     *           "_id": "572c760f880b964e7ac06085",
     *           "title": "Root2!",
     *           "owner": "5729fec3b2102fdd1dd53a32",
     *           "__v": 1,
     *           "child": [],
     *           "parent": null,
     *           "root": null,
     *           "archived": false,
     *           "date": "2016-05-06T10:46:39.187Z"
     *         }
     *       ]
     *     }
     *
     * @apiError MissingToken No token provided.
     * @apiError WrongToken Token not matched on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "todo": "Write better error example."
     *       "error": "UserNotFound"
     *     }
     */
    app.get('/api/todo', passport.authenticate('jwt', { session: false}), function (req, res) {
        check(req, res, function (err, user) {
            if(!err){

                Todo.fetchTodos(user, function (err, data) {
                    if(!err){
                        res.json(data);
                    }
                });
            }
        });
    });

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
