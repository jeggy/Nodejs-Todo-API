/**
 * Created by Jógvan on 02/05-2016 14:40.
 */


var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();

app.use(bodyParser.urlencoded({extended: false})); // JSON parsing

app.use(passport.initialize());
app.use(passport.session());

require('./libs/passport')(passport);


require('./app/routes')(app);

var Todo =require('./app/models/todo');
// new Todo({
//     title: "Super Child!",
//     owner: "5729fec3b2102fdd1dd53a32",
//     root: "572c5f17e2cce1e442ff1c9c",
//     parent: "572c5fad5993c09c451c31a2"
// }).save();

// Todo.fetchTodos();

app.listen(3000);
