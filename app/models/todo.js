/**
 * Created by Jógvan on 02/05-2016 19:06.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');
var Entry = require('./entry');

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
    console.log(this);
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
                parentChildsArray.splice(1, parentChildsArray.indexOf(todo), map[todo._id]);
            }else if(todo.root == null){
                roots.push(map[todo._id]);
            }
        });

        callback(null, roots);
    });
};

module.exports = mongoose.model('Todo', TodoSchema);


