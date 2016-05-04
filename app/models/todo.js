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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entries: {
        type: [Entry]
    }
});

module.exports = mongoose.model('Todo', TodoSchema);


