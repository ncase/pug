(function(exports){

	// Singleton
	var Mouse = {
		x: 0,
		y: 0,
		pressed: false
	};
	exports.Mouse = Mouse;
	
	// Event Handling
	var canvas = document.getElementById("canvas");
	var onMouseMove,onTouchMove;
	
	canvas.addEventListener("mousedown",function(event){
	    Mouse.pressed = true;
	    onMouseMove(event);
	},false);

	canvas.addEventListener("mouseup",function(event){
	    Mouse.pressed = false;
	},false);

	canvas.addEventListener("mousemove",onMouseMove = function(event){
		Mouse.x = event.pageX - canvas.parentNode.parentNode.offsetLeft;
		Mouse.y = event.pageY - canvas.parentNode.parentNode.offsetTop;
	},false);

	canvas.addEventListener("touchstart",function(event){
	    Mouse.pressed = true;
	    onTouchMove(event);
	},false);

	canvas.addEventListener("touchend",function(event){
	    Mouse.pressed = false;
	},false);

	canvas.addEventListener("touchmove",onTouchMove = function(event){
		Mouse.x = event.changedTouches[0].clientX - canvas.parentNode.parentNode.offsetLeft;
		Mouse.y = event.changedTouches[0].clientY - canvas.parentNode.parentNode.offsetTop;
	},false);


})(window);