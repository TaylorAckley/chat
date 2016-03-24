// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');


app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

//env
var port                    = process.env.PORT || 3000;
var APP_URL           			= process.env.APP_URL;
var MONGOLAB_URI           	= process.env.MONGOLAB_URI || 'mongodb://localhost/chat';
var MAILGUN_API           	= process.env.MAILGUN_API;
var MAILGUN_DOMAIN          = process.env.MAILGUN_DOMAIN;
var TOKEN_SECRET            = process.env.TOKEN_SECRET;

// Routing
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

mongoose.connect(MONGOLAB_URI);

mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var Message = require('./backend/models/Message.js');

// globals
var userCount = 0;
var defaultRoom = '#general';
var rooms = ['#general', '#random'];
var defaultUser = "TaylorAckley";

// events

io.on('connection', function(socket) {
  userCount += 1;
  console.log(userCount + ' Users Connected');
  socket.emit('setup', {
    rooms: rooms
  });
  socket.on('new user', function(user) {
    user.room = defaultRoom;
    user.count = userCount;
    socket.join(defaultRoom);
    io.in(defaultRoom).emit('user joined', user);
  });
  socket.on('switch room', function(user) {
    socket.leave(user.oldRoom);
    socket.leave(user.newRoom);
    io.in(user.oldRoom).emit('user left', data);
    io.in(user.newRoom).emit('user joined', data);
  });
  socket.on('new message', function(data) {
    var newMessage = new Message({
      username: data.username,
      content: data.message,
      room: data.room.toLowerCase(),
    });
    console.log('Server: Message Submitted');
    newMessage.save(function(err, msg) {
      io.in(msg.room).emit('new message', msg);
    });

  });
  socket.on('disconnect', function(socket) {
    userCount -= 1;
  });

});


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
