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
//     title: "Child_root2!",
//     owner: "5729fec3b2102fdd1dd53a32",
//     root: "572c760f880b964e7ac06085",
//     parent: "572c760f880b964e7ac06085"
// }).save();

var User = require('./app/models/user');
User.findOne({_id: "5729fec3b2102fdd1dd53a32"}, function (err, doc) {

    Todo.fetchTodos(doc, function (err, todos) {
        todos.forEach(function (todo) {
            console.log(todo.title);
        });
    })
});

// Todo.fetchTodos();

app.listen(3000);
