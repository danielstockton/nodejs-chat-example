var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Messages = new Schema({
    body     : String
});

var Chat = new Schema({
    title     : String,
    messages  : [Messages]
});

mongoose.model('Chat', Chat)
