var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    content: {type: String, required: true, trim: true,  index: true},
    vote_up: {type: Number, default: 0},
    vote_down: {type: Number, default: 0},
    username: String,
    room: String,
    //created_by: {type: Schema.ObjectId, required: true, ref: 'users'},
    //updated_by: {type: Schema.ObjectId, required: false, ref: 'users'},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

messageSchema.pre('save', function(next){
    var now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model('messages', messageSchema);
