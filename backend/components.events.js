var mongoose  = require('mongoose');
var Message   = require('./models/Message.js');
var config    = require('./config.js');

module.exports = function(io, app) {
  // globals
  var userCount = 0;
  var defaultRoom = 'general';
  var rooms = ['general', 'random'];
  var defaultUser = "TaylorAckley";

  // events

  io.on('connection', function(socket) {
    userCount += 1;
    console.log(userCount + ' Users Connected');
    socket.emit('setup', {
      users: userCount,
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
        user: data.user,
        content: data.message,
        room: data.room,
      });
      console.log('Server: Message Submitted');
      newMessage.save(function(err, msg) {
        if (err) {
          console.log(err);
        }
        console.log(msg);
        msg.username = data.username;
        io.in(msg.room).emit('message created', msg);
      });

    });
    socket.on('disconnect', function(socket) {
      userCount -= 1;
    });

  });
};
