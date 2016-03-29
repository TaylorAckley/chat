var mongoose  = require('mongoose');
var User      = require('./models/Users.js');
var moment    = require('moment');
var jwt       = require('jsonwebtoken');
var randtoken = require('rand-token');
var Mailgun   = require('mailgun-js');
var config    = require('./config.js');
var helpers   = require('./helpers.js');


module.exports = function(app) {
  // Authorization

  function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}

// generate Token

function createJWT(user) {
  console.log('Assigning token');
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.sign(payload, config.TOKEN_SECRET);
}

// get user

app.get('/api/users', function(req, res) {
  User.find({}, function(err, users) {
    res.send(users);
  });
});

app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});


app.put('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.status(200).end();
    });
  });
});

// login

app.post('/auth/login', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }
      res.send({ token: createJWT(user) });
    });
  });
});

app.post('/auth/signup', function(req, res) {
  var token = randtoken.generate(8);
  User.findOne({email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      verified: false,
      token: {
        token: token,
        used: false
      }
    });

    user.save(function(err, result) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      var data = {
        from: config.EMAIL_FROM,
        to: req.body.email,
        subject: 'Confirm Your Email Address',
        html: 'Thank you for creating a chat account!   Please confirm your account by clicking on the link: <a href="http://' + config.APP_URL + '/#/verify-email?token=' + token + '">Click here to confirm your email.</a><p>Confirmation Code: ' + token + '</p><p>' + config.APP_URL + '/#/verify-email/?token=' + token + '</p>'
      };
      helpers.sendMail(data, function(err, result) {
        console.log('Sending confirmation email');
        if (err) {
          console.log(err);
          return res.status(409).send({message: 'Error sending email'});
        }
        return res.status(200).send({message: 'successfully sent PW reset email'});
      });
      // TODO -- Remove....  res.send({ token: createJWT(result) });
    });

  });
});

app.put('/auth/verifyemail', function(req, res) {
  User.findOne({token: req.body.token}, function(err, user) {
  if (!user) {
    return res.status(400).send({message: 'Token not found'});
  }
  if(user.verified === true) {
    return res.status(200).send({message: 'User is already verfied', token: createJWT(user)});
  }
  user.verified = true;
  user.token = {
    token: token,
    used: true,
    dateUsed: new Date()
  };
  user.save(function(err) {
    return res.status(200).send({message: 'Success', token: createJWT(user)});
  });
});
  });

app.post('/auth/forgotPassword', function(req, res) {
User.findOne({email: req.body.email}, function(err, existingUser) {

if(!existingUser) {
  return res.status(409).send({message: 'Email not found'});
}
var token   = randtoken.generate(8);

User.update({email: req.body.email},{passwordReset: token}, {multi: false}, function(err, numAffected) {
  if(err) {
    return  res.status(409).send({message: 'Error generating token'});
  }
});
var data = {
  from: 'Issuefy@issuefy.com',
  to: req.body.email,
  subject: 'Password Reset for Chat',
  html: 'A password reset was requested for your Chat account. <a href="' + config.APP_URL + '"/resetPassword?token=' + token + '">Click here to reset your password.</a>'
};
helpers.sendMail(data, function(err, result) {
  console.log('Time to send an email!');
  if (err) {
    console.log(err);
    return res.status(409).send({message: 'Error sending email'});
  }
  res.send({message: 'successfully sent PW reset email'});
});
});
});

app.post('/auth/resetPassword', function(req, res) {
  console.log(req.query.token);
  User.findOne({passwordReset: req.query.token}, function(err, user) {
    if (!user) {
      return res.status(409).send({message: 'Token not found'});
    }
    res.send({message: 'Success', user: user});
  });
  });

  app.post('/auth/resetPasswordDone', function(req, res) {
    User.update({email: req.body.email}, {password: req.body.password}, {multi: false}, function(err, user) {
      if (err) {
        res.status(409).send({message: 'Token not found'});
      }
      res.send({message: 'Password succesfully changed', token: createJWT(user)});
    });

});

};
