
var mongoose  = require('mongoose');
var Message   = require('./models/Message.js');
var config    = require('./config.js');


module.exports = function(app) {


app.get('/api/messages', function(req, res) {
  Message.find({}, function(err, messages) {
    if (err) {
      return res.status(409).send({message: 'There was an error retrieving messages ' + err});
    }
    res.send(messages);
  });
});

};
