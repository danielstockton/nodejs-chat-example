
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose');

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

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/chat', function(req, res){
  res.render('chat', {locals: {
    title: 'NowJS + Express Example'
  }});
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}

// NowJS

var nowjs = require('now');
var everyone = nowjs.initialize(app);

everyone.connected(function(){
  console.log("Joined: " + this.now.name);
});


everyone.disconnected(function(){
      console.log("Left: " + this.now.name);
});

everyone.now.distributeMessage = function(message){
  everyone.now.receiveMessage(this.now.name, message);
};
