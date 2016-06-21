/**
 * Created by Jógvan, Mik & Jan on 02/05-2016 19:01.
 */

module.exports = function(app){

    [
        'user',
        'todo'
    ]
        .forEach(function (route) {
        require('./routes/'+route)(app);
    });

};



