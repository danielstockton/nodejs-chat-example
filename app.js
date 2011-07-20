
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    models = require('./models/index');

var app = module.exports = express.createServer();

mongoose.connect('mongodb://localhost/chatexample');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Models

var Chat = mongoose.model('Chat');

// Routes

app.get('/', function(req, res){
  var chat = new Chat();
  res.render('index', {
    title: 'Chat Example in NodeJS',
    id: chat._id
  });
});

app.post('/chat/:id', function(req, res) {
  var chat = new Chat();
  chat.title = req.body.title;
  chat.save(function (err) {
    if (!err) {
      console.log('Chat saved successfully!');
    }
  });
  res.redirect('/chat/' + chat._id);
});

app.get('/chat/:id', function(req, res){
  Chat.findById(req.params.id, function (err, chat) {
    if (!err) {
      res.render('chat', {
          title: chat.title,
          room:  chat._id 
      });
    }
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}

// NowJS

var nowjs = require('now'),
    everyone = nowjs.initialize(app);

everyone.connected(function(){
  nowjs.getGroup(this.now.room).addUser(this.user.clientId);
  console.log("Joined: " + this.now.name);
});


everyone.disconnected(function(){
      console.log("Left: " + this.now.name);
});

everyone.now.changeRoom = function(newRoom){
  nowjs.getGroup(this.now.room).removeUser(this.user.clientId);
  nowjs.getGroup(newRoom).addUser(this.user.clientId);
  this.now.room = newRoom;
  this.now.receiveMessage("SERVER", "You're now in " + this.now.room);
};

everyone.now.distributeMessage = function(message){
   nowjs.getGroup(this.now.room).now.receiveMessage(this.now.name, message);
};
