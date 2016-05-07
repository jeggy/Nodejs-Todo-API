/**
 * Created by Jógvan on 02/05-2016 19:01.
 */

module.exports = function(app){

    require('./routes/user')(app);
    require('./routes/todo')(app);

};



