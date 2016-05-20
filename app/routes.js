/**
 * Created by Jógvan on 02/05-2016 19:01.
 */

var user = require('./routes/user');
var todo = require('./routes/todo');


module.exports = function(app){

    app.use('/api/', user);
    app.use('/api/', todo);
    // require('./routes/user')(app);
    // require('./routes/todo')(app);

};



