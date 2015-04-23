function Spirograph() {
	this.init = function() {
		this.radii = [0,0,0,0,0,0,0]; // starting values
		this.speeds =  [-Math.PI/900, 3*Math.PI/300, 9*-Math.PI/300, 27*Math.PI/300, 81*-Math.PI/300, 81*3*Math.PI/300]
		this.toDraw = [0,0,0,0,0,1];

		this.fractal = document.getElementById('fractal');
		this.circles = document.getElementById('circles');
		this.fCtx = this.fractal.getContext('2d');
		this.cCtx = this.circles.getContext('2d');

		this.w = circles.width;
		this.h = circles.height;
		this.rotate = [0,0,0,0,0,0,0];
		this.pX = 0;
		this.pY = 0;
		this.rCount = 0;
		this.r = Math.random() * 255;
		this.g = Math.random() * 255;
		this.b = Math.random() * 255;
		this.rD = -5;
		this.gD = -5;
		this.bD = 5;

		this.fCtx.strokeStyle = '#99FFFF';
		this.fCtx.fillStyle   = 'rgba( 0, 0, 0, .05 )';
		this.fCtx.lineWidth   = 2;

		this.cCtx.strokeStyle = '#FFFFFF';
		this.cCtx.lineWidth   = 2;
	}

	this.render = function() {
		this.x = this.w/2;
		this.y = this.h/2;
		this.r = Math.min(this.w,this.h)/2;
		this.r2;

  // change stroke color
  this.b += this.bD;
  if( !this.b || ( 255 === this.b ) ){
  	this.bD *= -1;
  	this.g += this.gD;
  	if( !this.g || ( 255 === this.g ) ){
  		this.gD *= -1;
  		this.r += this.rD;
  		if( !this.r || ( 255 === this.r ) ){
  			this.rD *= -1;
  		}
  	}
  }
  this.fCtx.strokeStyle = '#' + ( ( 1<<24 ) + ( this.r<<16 ) + ( this.g<<8 ) + this.b ).toString(16).substr(1);

  // partially erase the line
  if( !( ++this.rCount % 20 ) ){
  	this.fCtx.fillRect( 0, 0, this.w, this.h );
  }
  
  // clear the circles
  this.cCtx.clearRect( 0, 0, this.w, this.h );

  // draw one circle
  function drawCircle( ix , t){
  	$this = t;
  	$this.cCtx.beginPath();
  	$this.cCtx.arc( this.x, this.y, this.r, 0, 2 * Math.PI, false );
  	$this.cCtx.stroke();

  	if( $this.toDraw[ ix - 1 ] ){
  		$this.fCtx.beginPath();
  		if( $this.pX || $this.pY ){
  			$this.fCtx.moveTo( $this.pX, $this.pY );
  			$this.fCtx.lineTo( $this.x, $this.y );
  			$this.fCtx.stroke();
  		}
  		$this.pX = this.x;
  		$this.pY = this.y;
  	}
  }

  // draw the circles
  for( var i=0, l=this.rotate.length; i<l; i++ ){
  	drawCircle( i , this);
    this.r2 = this.r * this.radii[i+1]; // shrink each circle
    this.rotate[ i ] += .1 * this.speeds[ i ] * 10;
    this.x += ( this.r - this.r2 ) * Math.cos( this.rotate[ i ] );
    this.y += ( this.r - this.r2 ) * Math.sin( this.rotate[ i ] );
    this.r = this.r2;
}
}

}

var s = new Spirograph();
s.init();

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function animloop(){
  requestAnimFrame(animloop);
  s.render();
  // render();
})();