var express   = require('express');
var fs        = require('fs');
var io        = require('socket.io');
var _         = require('underscore');
var Mustache  = require('mustache');

var app       = express.createServer();
var staticDir = express.static;

io            = io.listen(app);

var opts = {
	port :      1947,
	baseDir :   __dirname + '/../../'
};
var os = require('os');

function getAddresses(cb){
  var interfaces = os.networkInterfaces();
  for (k in interfaces){
      for (k2 in interfaces[k]){
        var address = interfaces[k][k2];
        if(address.family == 'IPv4' && !address.internal){
          cb(address.address);
        }
      }
  }
}

io.sockets.on('connection', function(socket) {
	socket.on('slidechanged', function(slideData) {
		socket.broadcast.emit('slidedata', slideData);
	});
	socket.on('fragmentchanged', function(fragmentData) {
		socket.broadcast.emit('fragmentdata', fragmentData);
	});
  socket.on('remote_connected', function(){
    console.log('remote connected');
  });
  socket.on('remote', function(data){
    console.log('remote command', data);
    io.sockets.in('offerer').emit('remote_command', data);
  });
  socket.on('rtc_init_receiver', function(data){
    console.log('received joined');
    this.join('receiver');
  });
  
  socket.on('rtc_init_offerer', function(data){
    console.log('offerer has joined');
    this.join('offerer');
  });
  
  socket.on('rtc_answer', function(data){
    console.log(data);
    io.sockets.in('offerer').emit('rtc_answer', data);
  });
  
  socket.on('rtc_request', function(data){
    console.log(data);
    io.sockets.in('receiver').emit('rtc_request', data);
  });
});

app.configure(function() {
	[ 'css', 'js', 'images', 'plugin', 'lib' ].forEach(function(dir) {
		app.use('/' + dir, staticDir(opts.baseDir + dir));
	});
});

app.get("/receiver", function(req, res){
  fs.createReadStream(opts.baseDir + '/receiver.html').pipe(res);
});

app.get("/", function(req, res) {
	fs.createReadStream(opts.baseDir + '/index.html').pipe(res);
});
app.get("/remote", function(req, res){
  fs.createReadStream(opts.baseDir + '/plugin/webrtc-server/controller.html').pipe(res);
});
app.get("/remote2", function(req, res){
  fs.createReadStream(opts.baseDir + '/plugin/webrtc-server/controller2.html').pipe(res);
});
app.get("/notes/:socketId", function(req, res) {

	fs.readFile(opts.baseDir + 'plugin/notes-server/notes.html', function(err, data) {
		res.send(Mustache.to_html(data.toString(), {
			socketId : req.params.socketId
		}));
	});
	// fs.createReadStream(opts.baseDir + 'notes-server/notes.html').pipe(res);
});

// Actually listen
app.listen(opts.port || null);

var brown = '\033[33m',
	green = '\033[32m',
	reset = '\033[0m';

var slidesLocation = "http://localhost" + ( opts.port ? ( ':' + opts.port ) : '' );

console.log( brown + "reveal.js - WebRTC Server and socket.io remote control" + reset );
getAddresses(function(address){
  console.log('Your server is listening on http://' + address + ':1947/');
});
