/**
 * Created by Jógvan on 02/05-2016 20:17.
 */

module.exports = function(Schema){
    var User = require('./user')(Schema);

    var noteSchema = Schema({
        title: {type: String, required: true},
        content: String,
        owner: {type: User, required: true}
    });

    // Validation
    noteSchema.path('title').validate(function (value) {
        return value.length > 0 && value.length < 80
    });

    return noteSchema;
};
