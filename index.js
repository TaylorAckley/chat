// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;


// Routing
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// events

// globals
var userCount = 0;

io.on('connection', function(socket) {
  userCount += 1;
  console.log(userCount + ' Users Connected');
  socket.on('new message', function(msg) {
    console.log('Server: Message Submitted');
    io.emit('new message', msg);
  });
  socket.on('disconnect', function(socket) {
    userCount -= 1;
  });

});


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
