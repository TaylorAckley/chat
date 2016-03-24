// Setup basic express server
var express         = require('express');
var app             = express();
var server          = require('http').createServer(app);
var io              = require('socket.io')(server);
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var path            = require('path');
var colors          = require('colors');
var cors            = require('cors');
var async           = require('async');
var bcrypt          = require('bcryptjs');
var moment          = require('moment');
var request         = require('request');
var mongoose        = require('mongoose');
var config          = require('./backend/config.js');


app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

// Routing
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


mongoose.connect(config.MONGOLAB_URI);

mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var Auth 		= require('./backend/routes.auth.js')(app);
var Messages 		= require('./backend/routes.messages.js')(app);
var Events  = require('./backend/components.events.js')(io, app);

console.log(config);

server.listen(config.port, function () {
  console.log('Server listening at port %d', config.port);
});
