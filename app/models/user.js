/**
 * Created by Jógvan on 02/05-2016 19:06.
 */


module.exports = function(Schema){

    var userSchema = Schema({
        username: {type: String, required: true},
        password: {type: String, required: true}
    });

    userSchema.path('username').validate(function (value) {
        return value.length > 0 && value.length < 100;
    });

    userSchema.path('password').validate(function (value) {
        return value.length > 4;
    });

    return userSchema;
};
