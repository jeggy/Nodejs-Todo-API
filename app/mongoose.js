/**
 * Created by Jógvan, Mik & Jan on 02/05-2016 20:15.
 */

// This file is not used any more.

var mongoose = require('mongoose');

mongoose.connect(require('../config/config.js').mongoose.uri);

console.log("Testing");

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
// var Schema = mongoose.Schema;
//
// module.exports.Note = mongoose.model('Note', require('./models/note')(Schema));
// module.exports.User = mongoose.model('User', require('./models/user')(Schema));
// module.exports.AccessToken = mongoose.model('AccessToken', require('./models/AccessToken')(Schema));
// module.exports.RefreshToken = mongoose.model('RefreshToken', require('./models/RefreshToken')(Schema));
// module.exports.Client = mongoose.model('Client', require('./models/Client')(Schema));

