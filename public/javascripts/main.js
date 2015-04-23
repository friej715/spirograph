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

				s.init(data.message.uuid, abs, pwr-(Math.random() * pwr) * 10, pwr, '#'+Math.floor(Math.random()*16777215).toString(16))
				s.updateSeen(new Date().getTime())
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
				spirographs[which].updateRSSI(data.message.rssi)
				spirographs[which].updateSeen(new Date().getTime())
				spirographs[which].updateDraw(true)
			}
		}

	})



	// spirozzzzzz
	setInterval(function() {
		for (var i = 0; i < spirographs.length; i++) {
			spirographs[i].drawPoint();
		}

		ctx.fillStyle="rgba(0, 0, 0, 0.03)";
		ctx.fillRect(0,0, 1000, 1000)
	}, 1)

	setInterval(function() {
		for (var i = 0; i < spirographs.length; i++) {
			if (new Date().getTime() - spirographs[i].lastSeen > 10000) {
				console.log("spirograph " + i + " is old--delete");
				spirographs[i].shouldDraw = false;
			}
		}
	}, 10000)

	function Spirograph() {
		this.uuid = null;
		this.shouldDraw = null;

		this.lastSeen = null;

		this.fixedCircleRadius = null;
		this.movingCircleRadius = null;
		this.pointOffset = null;

		this.prevX = null;
		this.prevY = null;

		this.fillStyle = null;

		this.init = function(uuid, fixed, moving, point, style) {
			this.shouldDraw == true;
			this.uuid = uuid;
			this.fixedCircleRadius = fixed;
			this.movingCircleRadius = moving;
			this.pointOffset = point;
			this.fillStyle = style;
			console.log("fixed: " + this.fixedCircleRadius)
		}

		this.updateRSSI = function(val) {
			this.fixedCircleRadius = Math.abs(val) * 5;
		}

		this.updateSeen = function(time) {
			this.lastSeen = time;
		}

		this.updateDraw = function(d) {
			this.shouldDraw = d;
		}

		this.drawPoint = function() {
			if (this.shouldDraw == true) {
				var secs = new Date().getTime()/800;

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
				ctx.lineWidth = 0;
				ctx.fillRect(x, y, 3, 3)
			}
		}

	}



});
