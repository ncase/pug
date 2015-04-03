function Neuron(config){
	
	var self = this;
	
	// ID
	self.id = config.id;
	Neuron[self.id] = self;

	// Properties
	self.initX = config.x;
	self.initY = config.y;
	self.icon = new Image();
	self.icon.src = config.icon;

	// Impulse
	self.burstFrom = new Image();
	self.burstFrom.src = "neuron/neuron_burst_from.png";
	self.burstTo = new Image();
	self.burstTo.src = "neuron/neuron_burst_to.png";
	self.impulse = 0;
	self.connectionMode = 0;
	
	// Wobbling!
	var wobbleAngle = Math.random()*Math.TAU;
	var wobbleVelocity = (Math.random()-0.5)*0.1;
	var wobbleX = Math.random()*20;
	var wobbleY = Math.random()*20;

	// Impulse! Then 10 ticks later, pass it down.
	var pulseTimer = -1;
	var pulsePower = -1;
	self.pulse = function(power){
		
		if(power==0) return;

		self.impulse = 1;
		pulsePower = power;
		pulseTimer = 10;

		publish("/neuron/"+self.id);

	};

	// Update
	self.update = function(){
		
		wobbleAngle += wobbleVelocity;

		// Impulse fade
		if(self.impulse>0.5){
			self.impulse *= 0.9;
		}else{
			self.impulse *= 0.985;
		}
		if(self.impulse<0.12){
			self.impulse = 0;
		}

		// Mode?
		if(self.impulse==0){
			self.connectionMode = 0;
		}else if(self.impulse>0.5){
			self.connectionMode = -1; // to
		}else{
			self.connectionMode = 1; // from
		}

		// Send pulse down?
		if(pulseTimer>=0){
			pulseTimer--;
			if(pulseTimer==0){				

				// Find all connections where this is a "from"
				var fromMeConnections = window.connections.filter(function(connection){
					return(connection.from==self.id);
				});

				// Pulse down each one
				fromMeConnections.forEach(function(connection){
					connection.pulse(pulsePower-1);	
				});
				
			}
		}

	};
	self.updatePosition = function(){
		self.x = self.initX + wobbleX*Math.sin(wobbleAngle);
		self.y = self.initY + wobbleY*Math.cos(wobbleAngle);
	};
	self.updatePosition();

	// Draw
	self.draw = function(ctx){

		ctx.save();

		// Wobble position
		self.updatePosition();
		ctx.translate(self.x,self.y);

		// Burst?
		if(self.impulse>0){
			ctx.save();
			var scale = 0.5 + (0.5-Math.abs(self.impulse-0.5));
			ctx.scale(scale,scale);
			ctx.globalAlpha = 0.3;
			if(self.impulse>0.5){
				ctx.drawImage(self.burstTo,-75,-75,150,150);
			}else{
				ctx.drawImage(self.burstFrom,-75,-75,150,150);
			}
			ctx.restore();
		}

		// Draw circle
		ctx.beginPath();
		ctx.arc(0, 0, 40, 0, Math.TAU, false);
		if(self.impulse==0){
			ctx.fillStyle = '#000';
		}else{
			var bright = Math.round(250*self.impulse * ((pulsePower-1)/3));
			if(bright>255) bright=255;
			ctx.fillStyle = 'rgb('+bright+','+bright+','+bright+')';
		}
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#FFF';
		ctx.stroke();

		// Draw icon
		ctx.drawImage(self.icon,-40,-40,80,80);

		ctx.restore();

	};

};