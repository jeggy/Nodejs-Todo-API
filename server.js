/**
 * Created by Jógvan on 02/05-2016 14:40.
 */


var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false})); // JSON parsing


require('./app/routes')(app);


app.listen(3000);
