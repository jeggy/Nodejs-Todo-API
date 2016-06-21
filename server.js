/**
 * Created by Jógvan, Mik & Jan on 02/05-2016 14:40.
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();

// Setup database connection
mongoose.connect(require('./config/config').mongoose.uri);


/* Middle Ware */
// JSON parsing
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());

// Add's "Access-Control-Allow-Origin: *" to every api response
app.use(cors());



// Set the documentation to be on '/' (Index)
app.use('/', express.static(__dirname + '/apidoc/'));

// We'll set the passport strategies here
require('./libs/passport')(passport);


// set routes
require('./app/routes')(app);




app.listen(3000);
