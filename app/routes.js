/**
 * Created by Jógvan on 02/05-2016 19:01.
 */

var User = require('./models/user');

module.exports = function(app){

    require('./routes/user')(app);

    app.get('/api/articles', function(req, res) {
        res.send('This is not implemented now');
    });

    app.post('/api/articles', function(req, res) {
        res.send('This is not implemented now');
    });

    app.get('/api/articles/:id', function(req, res) {
        res.send('This is not implemented now');
    });

    app.put('/api/articles/:id', function (req, res){
        res.send('This is not implemented now');
    });

    app.delete('/api/articles/:id', function (req, res){
        res.send('This is not implemented now');
    });

};