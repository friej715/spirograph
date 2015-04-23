var express = require('express');
var request = require('request');
var router = express.Router();

var noble = require('noble');


// var devices = [];

// router.get('/', function(req, res, next) {
// 	noble.startScanning();
// 	noble.on('discover', logThis)
// });

function logThis(p) {
	// devices.push(p);

	// p.on('rssiUpdate', getRSSI)
}

function getRSSI(p) {
	// console.log(p.rssi)
}

// io.sockets.on('connection', function(socket) {
// 	socket.emit('message', {message: 'i did'});
// 	socket.on('send', function(data) {
// 		io.sockets.emit('message', data)
// 	})
// })



module.exports = router;