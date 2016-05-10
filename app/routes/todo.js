/**
 * Created by Jógvan on 04/05-2016 16:09.
 */


var passport = require('passport');
var tokenCheck = require('../../libs/get-token').check;
var Todo = require('../models/todo');

module.exports = function(app) {

    /**
     * @api {get} /api/todo Get's all todo's
     * @apiVersion 1.0.0
     * @apiName GetTodos
     * @apiGroup Todo
     *
     * @apiHeader {String} authorization Authorization value
     *
     * @apiSuccess {Todo} todo[] all todos and todos childs.
     *
     * @apiSuccessExample Success-Response:
     *   {
     *   "todos": [
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
     *   }
     *
     * @apiError MissingToken No token provided.
     * @apiError WrongToken Token not matched on server.
     *
     */
    app.get('/api/todo', passport.authenticate('jwt', { session: false}), function (req, res) {
        tokenCheck(req, res, function (err, user) {
            if(!err){
                Todo.fetchTodos(user, function (err, data) {
                    if(!err){
                        res.send({todos: data});
                    }
                });
            }
        });
    });

    /**
     * @api {post} /api/todo Post new Todo
     * @apiVersion 1.0.0
     * @apiName NewTodo
     * @apiGroup Todo
     *
     * @apiHeader {String} authorization Authorization value
     *
     * @apiParam {String} title Title
     * @apiParam {Date} [date] The date in ISO format (Ex: "2016-05-10T17:23:34.963Z")
     * @apiParam {String} [root] Root id
     * @apiParam {String} [parent] Parent id
     *
     * @apiSuccess {Todo} Returns the created Todo with all it's information.
     *
     * @apiSuccessExample Success-Response:
     *  {
     *    "__v": 0,
     *    "title": "Buy new socks",
     *    "owner": "57307aff57376d6e321da1f6",
     *    "_id": "573216ee61c2cb6201cb2ad4",
     *    "child": [],
     *    "parent": "573216bc61c2cb6201cb2ad3",
     *    "root": "5732165361c2cb6201cb2ad2",
     *    "archived": false,
     *    "date": "2015-05-10T13:42:33.659Z"
     *  }
     *
     * @apiError MissingToken No token provided.
     * @apiError WrongToken Token not matched on server.
     * @apiError MissingTitle No title provided for new Todo.
     *
     */
    app.post('/api/todo', passport.authenticate('jwt', { session: false}), function(req, res){
        tokenCheck(req, res, function (err, user) {
            if(!err){
                //
                var title = req.body.title;
                var date = new Date(req.body.date);
                var root = req.body.root;
                var parent = req.body.parent;

                if(date == null){
                    date = new Date();
                }

                var newTodo = new Todo({
                    title: title,
                    date: date,
                    owner: user
                });

                newTodo.root = root == '' ? null : root;
                newTodo.parent = parent == '' ? null : parent;



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

    /**
     * @api {put} /api/todo Update existing todo
     * @apiVersion 1.0.0
     * @apiName UpdateTodo
     * @apiGroup Todo
     *
     * @apiHeader {String} authorization Authorization value
     *
     * @apiParam {Number} id The id of the Todo you want to update.
     * @apiParam {String} [title] Update the title
     * @apiParam {String} [date] The date in ISO format (Ex: "2016-05-10T17:23:34.963Z")
     * @apiParam {Boolean} [archived] Set the archived status
     *
     * @apiSuccess {Todo} Returns if anything got modified
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "ok": 1,
     *      "nModified": 1,
     *      "n": 1
     *  }
     *
     * @apiError MissingToken No token provided.
     * @apiError WrongToken Token not matched on server.
     * @apiError MissingId No ID provided.
     *
     */
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
                if(req.body.archived){
                    update.archived = req.body.archived;
                }

                // TODO: maybe add the posibility to update root/parent

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

    /**
     * @api {delete} /api/todo/:id Remove Todo
     * @apiVersion 1.0.0
     * @apiName RemoveTodo
     * @apiGroup Todo
     *
     * @apiHeader {String} authorization Authorization value
     *
     * @apiParam {Number} id The id of the Todo you want to remove.
     *
     * @apiSuccess {Number} ok The status of the executed query
     * @apiSuccess {Number} n The number of Todo's removed
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "ok": 1,
     *      "n": 2
     *  }
     *
     * @apiError MissingToken No token provided.
     * @apiError WrongToken Token not matched on server.
     * @apiError MissingId No ID provided.
     *
     */
    app.delete('/api/todo/:id', passport.authenticate('jwt', { session: false}), function(req, res){
        tokenCheck(req, res, function (err, user) {
            if(!err){
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
