var express = require('express')
var app = express();
var path = require('path');
var request = require('request');
var routes = require('./routes/index');

var noble = require('noble');

app.use(function(req, res, next) {
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(express.static(__dirname + '/public'))
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req, res) {
	res.render('index')
	noble.startScanning([], true);
	noble.on('discover', logThis)
})

function logThis(p) {
	// if (p.advertisement.localName == "Time") {
		console.log("uuid: " + p.uuid + " & name: " + p.advertisement.localName)
		io.sockets.emit('newdevice', {message: {"uuid" : p.uuid, "rssi": p.rssi, "txPowerLevel" : p.advertisement.txPowerLevel}})
	// }
}

var io = require('socket.io').listen(app.listen(5000));

io.sockets.on('connection', function(socket) {
	socket.emit('message', {message: 'i did'});
	socket.on('send', function(data) {
		io.sockets.emit('message', data)
	})
})