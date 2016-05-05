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
    }
});

TodoSchema.methods.getTodos = function (owner, cb) {
    TodoSchema.find({owner: owner}, function (err, todos) {
        console.log(todos);
    });
};

module.exports = mongoose.model('Todo', TodoSchema);


