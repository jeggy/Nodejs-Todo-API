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

var Todo =require('./app/models/todo');
// new Todo({
//     title: "Child!",
//     owner: "5729fec3b2102fdd1dd53a32",
//     root: "572f6033c60ff4c4143e793b",
//     parent: "572f6033c60ff4c4143e793b"
// }).save();

// var User = require('./app/models/user');
// User.findOne({_id: "5729fec3b2102fdd1dd53a32"}, function (err, user) {
//
//     Todo.removeTest(user, "572f6033c60ff4c4143e793b", function (err, doc) {
//         console.log(doc);
//     });
// });



// Todo.fetchTodos();

app.listen(3000);
