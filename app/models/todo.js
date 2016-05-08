/**
 * Created by Jógvan on 02/05-2016 19:06.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');
var TodoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    archived: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    root: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
        default: null
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
        default: null
    },
    child: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Todo',
        default: []
    }
});

TodoSchema.pre('save', function (next) {
    var self = this;

    if(!self.isNew || !self.isModified('parent')) {
        next();
    }else if(self.parent){
        mongoose.models["Todo"].findOne({ _id : mongoose.Types.ObjectId(self.parent) }, function(err, doc) {
            if(err){
                next(err);
            }
            doc.child.push(self._id);

            doc.markModified('child');
            doc.save(function (err, doc) {
                if(err){
                    next(err);
                }
                next();
            });
        });
    }else{
        next();
    }
});

TodoSchema.statics.removeTodo = function(user, id, callback){

    mongoose.models["Todo"].fetchTodos(user, function(err, roots){
        if(err==null) {

            var stop = false;
            var search = function(current){
                if(current._id == id && stop == false){
                    findChildsIDs(current);
                    stop = true;
                }else {
                    current.child.forEach(function (child) {
                        search(child)
                    });
                }
            };

            var childs = [];
            var findChildsIDs = function (current) {
                childs.push(current._id);
                current.child.forEach(function (child) {
                    findChildsIDs(child);
                });
            };

            roots.forEach(function (root) {
                search(root);
            });

            console.log(JSON.stringify(childs));

            mongoose.models["Todo"].remove({_id: {$in: childs}}, function (err, effected) {
                if(err){
                    callback(err, null);
                }else{
                    callback(null, effected);
                }
            });
        }
    });

};

// TodoSchema.method

TodoSchema.statics.fetchTodos = function(user, callback) {

    mongoose.models["Todo"].find({ owner: user._id }, function(err, docs) {
        if(err){
            callback(err, null);
        }
        var map = {};
        var roots = [];
        docs.forEach(function (todo) {
            map[todo._id] = todo.toObject();
        });

        docs.forEach(function (todo) {
            if(todo.parent){
                var parentChildsArray = map[todo.parent].child;
                parentChildsArray.splice(parentChildsArray.indexOf(todo)-1, 1);
                parentChildsArray.push(map[todo._id]);
            }else if(todo.root == null){
                roots.push(map[todo._id]);
            }
        });

        callback(null, roots);
    });
};

module.exports = mongoose.model('Todo', TodoSchema);


