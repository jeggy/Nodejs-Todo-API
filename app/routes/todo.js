/**
 * Created by Jógvan on 04/05-2016 16:09.
 */

/*
 * tree module github: https://github.com/franck34/mongoose-tree
 *
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
var passport = require('passport');
var tokenCheck = require('../../libs/get-token').check;
var Todo = require('../models/todo');

module.exports = function(app) {

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
    // Done
    app.get('/api/todo', passport.authenticate('jwt', { session: false}), function (req, res) {
        tokenCheck(req, res, function (err, user) {
            if(!err){
                Todo.fetchTodos(user, function (err, data) {
                    if(!err){
                        res.json(data);
                    }
                });
            }
        });
    });
    
    // Done
    app.post('/api/todo', passport.authenticate('jwt', { session: false}), function(req, res){
        tokenCheck(req, res, function (err, user) {
            if(!err){
                //
                var title = req.body.title;
                var date = req.body.date;
                var root = req.body.root;
                var parent = req.body.parent;

                var newTodo = new Todo({
                    title: title,
                    date: date,
                    owner: user,
                    root: root,
                    parent: parent
                });

                newTodo.save(function (err) {
                    if(err){
                        res.status(400).send(err);
                    }else{
                        res.status(200).json(newTodo);
                    }
                });
            }
        });
    });

    // Done
    app.put('/api/todo', passport.authenticate('jwt', { session: false}), function(req, res){
        tokenCheck(req, res, function (err, user) {
            if(!err){
                var id = req.body.id;

                var update = {};
                if(req.body.title){
                    update.title = req.body.title;
                }
                if(req.body.date){
                    update.date = req.body.date;
                }

                Todo.update({_id: id, owner: user}, {$set: update}, {multi: false}, function (err, effected) {
                    if(effected.n == 1) {
                        res.send(effected);
                    }else{
                        res.status(401).send({success: false, msg: 'Either this Todo doesn\'t exists or you don\'t have permission to update'});
                    }
                });
            }
        })
    });

    // Done
    app.delete('/api/todo/:id', passport.authenticate('jwt', { session: false}), function(req, res){
        tokenCheck(req, res, function (err, user) {
            if(!err){
                console.log(req.params.id);
                Todo.removeTodo(user, req.params.id, function (err, effected) {
                    if(err){
                        res.status(500).send(err);
                    }else{
                        res.status(200).send(effected);
                    }
                });
            }
        })
    });
};
