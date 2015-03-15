Math.TAU = Math.PI*2;

(function(exports){

	exports.Experiment = {};

	Experiment.toggleQA = function(target){
		var currentState = target.parentNode.getAttribute("show");
		if(currentState=="yes"){
			target.parentNode.setAttribute("show","no");
		}else{
			target.parentNode.setAttribute("show","yes");
		}
	};

	Experiment.setInformation = function(config){

		var html = "";

		// TITLE
		html += "<span id='title'>"+config.title+"</span>";
		html += "<br><br>";
		html += config.description;
		html += "<br><br>";

		for(var i=0;i<config.qa.length;i++){
			var qa = config.qa[i];
			html += "<div class='qa' show='no'>";
			html += "<div id='q' onclick='Experiment.toggleQA(this);'>"+qa.q+"</div>";
			html += "<div id='a'>"+qa.a+"</div>";
			html += "</div>";
		}
		//html += 

		document.getElementById("info").innerHTML = html;

	};

	window.neurons = [];
	window.connections = [];
	window.sprites = [];

	Experiment.setBrain = function(config){
		for(var i=0;i<config.neurons.length;i++){
			neurons.push(new Neuron(config.neurons[i]));
		}
		for(var i=0;i<config.connections.length;i++){
			connections.push(new Connection(config.connections[i]));
		}
	};

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');

	Experiment.update = function(){

		// HACK - MOUSEY SHTUFF
		if(!Mouse.lastPressed && Mouse.pressed){
			// Bell
			if(Math.abs(Mouse.x-90)<50 && Math.abs(Mouse.y-320)<50){
				Sprite.bell.ring();
			}
			// Meat
			if(Math.abs(Mouse.x-550)<50 && Math.abs(Mouse.y-320)<50){
				Sprite.meat.click();
			}
		}
		Mouse.lastPressed = Mouse.pressed;

		// UPDATE
		for(var i=0;i<neurons.length;i++) neurons[i].update();
		for(var i=0;i<connections.length;i++) connections[i].update();
		for(var i=0;i<sprites.length;i++) sprites[i].update();

		// DRAW
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(var i=0;i<sprites.length;i++) sprites[i].draw(ctx);
		for(var i=0;i<connections.length;i++) connections[i].draw(ctx);
		for(var i=0;i<neurons.length;i++) neurons[i].draw(ctx);

	};

	setInterval(Experiment.update,1000/30);

})(window);