/**
 * Created by Jógvan, Mik & Jan on 02/05-2016 19:06.
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
        if(mongoose.Types.ObjectId.isValid(self.parent)) {
            mongoose.models["Todo"].findOne({_id: mongoose.Types.ObjectId(self.parent)}, function (err, doc) {
                if (err) {
                    next(err);
                }
                doc.child.push(self._id);

                doc.markModified('child');
                doc.save(function (err, doc) {
                    if (err) {
                        next(err);
                    }
                    next();
                });
            });
        }else{
            next({err: 'Not a valid parent id'});
        }
    }else{
        next();
    }
});

TodoSchema.statics.removeTodo = function(user, id, callback){

    mongoose.models["Todo"].fetchTodos(user, function(err, roots){
        if(err==null) {

            // Get all children's ID into an array
            var childs = [];
            var findChildsIDs = function (current) {
                childs.push(current._id);
                current.child.forEach(function (child) {
                    findChildsIDs(child);
                });
            };

            var parentId = null;
            var stopSearch = false;
            var search = function(current){
                if(current._id == id && !stopSearch){
                    parentId = current.parent;
                    findChildsIDs(current);
                    stopSearch = true;
                }else if(!stopSearch){
                    current.child.forEach(function (child) {
                        search(child)
                    });
                }
            };


            // Start recursive search for each root
            roots.forEach(function (root) {
                search(root);
            });

            if(parentId!=null){
                mongoose.models["Todo"].update({_id: parentId}, {$pull: {child: id}}, function (err, effected) {
                    
                })
            }
            
            mongoose.models["Todo"].remove({_id: {$in: childs}, $isolated : 1}, function (err, effected) {
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
            todo = todo.toObject();
            if(todo.parent){
                var parentChildsArray = map[todo.parent].child;
                
                for(var i = 0; i<parentChildsArray.length; i++){
                    if(todo._id._id == parentChildsArray[i]._id){
                        parentChildsArray.splice(i, 1);
                    }
                }
                parentChildsArray.push(map[todo._id]);
            }else if(todo.root == null){
                roots.push(map[todo._id]);
            }
        });

        callback(null, roots);
    });
};

module.exports = mongoose.model('Todo', TodoSchema);


