/**
 * Created by Jógvan on 02/05-2016 14:40.
 */
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var app = express();
var cors = require('cors');

app.use(bodyParser.urlencoded({extended: false})); // JSON parsing

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

// Mongo
mongoose.connect(require('./config/config').mongoose.uri);


// Set the documentation to be on '/' (Index)
app.use('/', express.static(__dirname + '/apidoc/'));

require('./libs/passport')(passport);

// set routes
require('./app/routes')(app);





app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res) {
    // Successful authentication, redirect home.
    res.send(req.user);
});


app.get('/a', function (req, res) {
    res.send(req.user);
});

app.listen(3000);
