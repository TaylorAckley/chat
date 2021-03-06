var mongoose  = require('mongoose');
var Message   = require('./models/Message.js');
var config    = require('./config.js');
var _         = require('lodash');

module.exports = function(io, app) {

  incrementRoom = function(r) {
    return _(rooms)
    .filter(function(prop) {
      return prop.name === r;
    })
    .map(function(prop) {
      return prop.count +=1;
    })
    .value();
  };

  decrementRoom = function(r) {
    return _(rooms)
    .filter(function(prop) {
      return prop.name === r;
    })
    .map(function(prop) {
      return prop.count -=1;
    })
    .value();
  };
  // globals
  var userCount = 0;
  var defaultRoom = 'general';
  var rooms = ['general', 'random'];
  var defaultUser = "TaylorAckley";



  // events

  io.on('connection', function(socket) {
    userCount += 1;
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

      newMessage.save(function(err, msg) {
        if (err) {
          console.log(err);
        }
        var ret = [msg, data.username];
        io.in(msg.room).emit('message created', ret);
      });

    });

    socket.on('disconnect', function(socket) {
      userCount -= 1;
      io.emit('disconnect');
    });

  });
};
