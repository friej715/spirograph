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
				var abs = Math.abs(data.message.rssi)
				var pwr = data.message.txPowerLevel;
				var msg = data.message.advLength;

				if (msg == undefined) {
					msg = .01
				}

				var color = '#'+Math.floor(Math.random()*16777215).toString(16);
				s.init(data.message.uuid, abs, msg, pwr, color)
				s.updateSeen(new Date().getTime())
				spirographs.push(s)
				$("body").append("<p id='" + data.message.deviceName + "' style='color:" + color +";'>" + data.message.deviceName + "</p>")
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

				var abs = Math.abs(data.message.rssi)
				var pwr = data.message.txPowerLevel;
				var msg = data.message.advLength;

				console.log(msg)

				if (msg == undefined) {
					msg = .01
				}


				spirographs[which].updateFixedCircleRadius(abs)
				spirographs[which].updateMovingCircleRadius(pwr);
				spirographs[which].updatePointOffset(msg);


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
		ctx.fillRect(0,0, 500, 500)
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
		}

		this.updateFixedCircleRadius = function(val) {
			this.fixedCircleRadius = Math.abs(val);
		}

		this.updateMovingCircleRadius = function(val) {
			this.movingCircleRadius = Math.abs(val);
		}

		this.updatePointOffset = function(val) {
			this.point = val;
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

				var x = (this.fixedCircleRadius+this.movingCircleRadius) * Math.cos(secs) - (this.movingCircleRadius+this.pointOffset) * Math.cos(((this.fixedCircleRadius + this.movingCircleRadius)/this.movingCircleRadius)*secs) + 250;

				var y = (this.fixedCircleRadius+this.movingCircleRadius) * Math.sin(secs) - (this.movingCircleRadius+this.pointOffset) * Math.sin(((this.fixedCircleRadius + this.movingCircleRadius)/this.movingCircleRadius)*secs) + 250;

				ctx.fillStyle=this.fillStyle;
				ctx.lineWidth = 0;
				ctx.fillRect(x, y, 3, 3)
			}
		}

	}



});
