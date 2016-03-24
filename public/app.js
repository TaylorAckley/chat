//$(function() {
  var socket = io('http://localhost:3000');

$('#chatform').submit(function() {
  var msg =  $('#message').val() + "-ing";
  socket.emit('new message', msg);
  console.log('Client: Message submitted: ' + msg);
  $('#message').val('');

  return false;
});

socket.on('new message', function(msg) {
  $('#messages').append('<p>').text(msg);
  console.log('Client: new message created');
});

//});
