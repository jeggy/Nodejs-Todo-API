/**
 * Created by Jógvan on 04/05-2016 16:05.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EntrySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    archived: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Entry', EntrySchema);