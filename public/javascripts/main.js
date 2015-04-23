$(document).ready(function() {
	// setupzzz
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	var spirographs = [];

	// sockitzzzzz
	var socket = io.connect('http://localhost:5000')

	socket.on('newdevice', function(data) {
		if (data.message) {

			var inArr = false;

			$.each(spirographs, function(index, obj) {
				$.each(obj, function(attr, val) {
					if (attr == "uuid") {
						if (data.message.uuid == val) {
							inArr = true;
						}
					}
				})
			})


			if (inArr == false) {
				var s = new Spirograph();
				var abs = Math.abs(data.message.rssi*5)
				var pwr = Math.abs(data.message.txPowerLevel);
				if (isNaN(pwr)) {
					pwr = 1;
				}
				console.log("pwr: " + pwr)

				s.init(data.message.uuid, abs+(Math.random() * abs) * 10, pwr-(Math.random() * pwr) * 10, pwr, '#'+Math.floor(Math.random()*16777215).toString(16))
				spirographs.push(s)
			} else {
				var which;

				$.each(spirographs, function(index, obj) {
					$.each(obj, function(attr, val) {
						if (attr == "uuid") {
							if (data.message.uuid == val) {
								which = index; 
							}
						}
					})
				})
				console.log(spirographs[which])
				spirographs[which]["fixedCircleRadius"] = Math.abs(data.message.rssi*5)

			}
		}

	})



	// spirozzzzzz
	setInterval(function() {
		for (var i = 0; i < spirographs.length; i++) {
			spirographs[i].drawPoint();
		}

		ctx.fillStyle="rgba(255, 255, 255, 0.01)";
		ctx.fillRect(0,0, 1000, 1000)
	}, 1)

	function Spirograph() {
		this.uuid = null;

		this.fixedCircleRadius = null;
		this.movingCircleRadius = null;
		this.pointOffset = null;

		this.prevX = null;
		this.prevY = null;

		this.fillStyle = null;

		this.init = function(uuid, fixed, moving, point, style) {
			this.uuid = uuid;
			this.fixedCircleRadius = fixed;
			this.movingCircleRadius = moving;
			this.pointOffset = point;
			this.fillStyle = style;
			console.log("fixed: " + this.fixedCircleRadius)
		}

		this.updateRSSI = function(val) {

		}

		this.drawPoint = function() {
			var secs = new Date().getTime()/500;

			var x = (this.fixedCircleRadius+this.movingCircleRadius) * Math.cos(secs) - (this.movingCircleRadius+this.pointOffset) * Math.cos(((this.fixedCircleRadius + this.movingCircleRadius)/this.movingCircleRadius)*secs) + 500;

			var y = (this.fixedCircleRadius+this.movingCircleRadius) * Math.sin(secs) - (this.movingCircleRadius+this.pointOffset) * Math.sin(((this.fixedCircleRadius + this.movingCircleRadius)/this.movingCircleRadius)*secs) + 500;

			// ctx.strokeStyle = this.fillStyle;
			// ctx.beginPath();
			// ctx.moveTo(this.prevX, this.prevY);
			// ctx.lineTo(x, y);
			// ctx.stroke();

			// this.prevX = x;
			// this.prevY = y;

			ctx.fillStyle=this.fillStyle;
			ctx.strokeStyle="rgba(0,0,0, 0)"
			ctx.fillRect(x, y, 3, 3)
		}

	}



});
