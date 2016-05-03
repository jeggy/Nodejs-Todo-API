/**
 * Created by Jógvan on 02/05-2016 19:01.
 */

var User = require('./models/user');

module.exports = function(app){

    require('./routes/user')(app);

    app.get('/', function (req, res) {
        res.send("Hello World!");
    });

};