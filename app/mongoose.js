/**
 * Created by Jógvan on 02/05-2016 20:15.
 */

var mongoose = require('mongoose');

mongoose.connect(require('../config/database.js').mongoose.uri);

/*
 * Just some comments about mongoose:
 *
 * Mongoose automatically makes the collection name to plural:
 * Read comments here: http://stackoverflow.com/a/10559895/1832471
 *
 * Full documentation: http://mongoosejs.com/docs/models.html
 *
 * All documents have version keys: http://mongoosejs.com/docs/guide.html#versionKey
 */

// Schemas:
var Schema = mongoose.Schema;
var NoteModel = require('./models/note')(Schema);
var UserModel = require('./models/user')(Schema);

module.exports.Note = mongoose.model('Note', NoteModel);
module.exports.User = mongoose.model('User', UserModel);

