var mongoose        = require('mongoose');
var async           = require('async');
var bcrypt          = require('bcryptjs');
var Schema          = mongoose.Schema;

// user schema
var UserSchema = new Schema({
    email: {type: String, required: true, lowercase: true, trim: true, unique: true},
    password: { type: String, required: true},
    username: {type: String, required: true, lowercase: true, trim: true, unique: true},
    token: String,
    verified: Boolean,
    passwordReset: {type: String, required: false},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

UserSchema.pre('save', function(next){
    var now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('users', UserSchema);
