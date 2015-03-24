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

	var infoContainerDOM = document.getElementById("info_container");
	var infoDOM = document.getElementById("info");
	Experiment.addInformation = function(text){

		// Create Paragraph
		var paragraph = document.createElement("p");
		paragraph.innerHTML = text;

		// Append Paragraph
		//paragraph.style.left = "350px";
		paragraph.style.opacity = 0;
		infoDOM.appendChild(paragraph);
		setTimeout(function(){
			//paragraph.style.left = "0px";
			paragraph.style.opacity = 1;
		},1);

		// Scroll to bottom
		var start = infoContainerDOM.scrollTop;
		var end = infoContainerDOM.scrollHeight - infoContainerDOM.offsetHeight;
		var t = 0;
		var animLoop = setInterval(function(){
			
			t+=3/60;
			var t2 = (1-Math.cos(t*Math.PI))/2;
			infoContainerDOM.scrollTop = start*(1-t2) + end*t2;
			
			if(t>=1) clearInterval(animLoop);

		},1000/60);
		

	};

	Experiment.setInformation = function(config){

		// Title
		var html = "";
		html += "<span id='title'>"+config.title+"</span>";

		// Paragraphs
		for(var i=0;i<config.paragraphs.length;i++){
			var paragraph = config.paragraphs[i];
			html += "<p>"+paragraph+"</p>";
		}

		// Create DOM
		infoDOM.innerHTML = html;

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