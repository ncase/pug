function Connection(config){

	var self = this;
	
	// Config
	self.from = config.from;
	self.to = config.to;
	self.strength = config.strength;

	// Pulse
	var pulseTimer = -1;
	var pulsePower = -1;
	self.pulse = function(power){
		if(power==0) return;
		if(self.strength==1){
			pulseTimer = 30;
			pulsePower = power;
		}
	};

	// Update
	self.update = function(){

		// Check from & to's connection
		var from = Neuron[self.from];
		var to = Neuron[self.to];
		if(from.connectionMode==1 && to.connectionMode==-1){
			self.strength += 0.06; // should connect in three tries
		}

		// Strength boundaries
		if(self.strength>1){
			self.strength=1;
		}

		// The strengthness - Easing in...
		strengthness = strengthness*0.8 + self.strength*0.2;

		// Send pulse down?
		if(pulseTimer>=0){
			pulseTimer--;
			if(pulseTimer==0){
				Neuron[self.to].pulse(pulsePower);
			}
		}

	};

	// Draw
	var strengthness = 0;
	self.draw = function(ctx){

		ctx.save();
		var radius = 35;

		// Translate & Rotate so that it's FROM LEFT TO RIGHT
		var from = Neuron[self.from];
		var to = Neuron[self.to];
		var dx = from.x-to.x;
		var dy = from.y-to.y;
		var distance = Math.sqrt(dx*dx+dy*dy) - 2*radius;
		var angle = Math.atan2(dy,dx);
		ctx.translate(from.x,from.y);
		ctx.rotate(angle+Math.TAU*0.5);

		// Only draw if there's even a little connection
		if(strengthness>0){

			var connectionColor = (self.strength==1) ? '#fff' : '#999';

			// Draw from & to lines
			var gapLeft = 0.5*strengthness;
			var gapRight = 1-gapLeft;
			var fromPosition = radius+distance*gapLeft;
			var toPosition = radius+distance*gapRight;
			ctx.beginPath();
			ctx.moveTo(radius,0);
			ctx.quadraticCurveTo(radius,25,fromPosition,25);
			ctx.moveTo(toPosition,25);
			ctx.quadraticCurveTo(radius+distance,25,radius+distance,0);
			ctx.lineWidth = 5;
			ctx.strokeStyle = connectionColor;
			ctx.stroke();

			// Draw to synapse
			ctx.beginPath();
			ctx.arc(toPosition, 25, 10, -Math.TAU*0.3, Math.TAU*0.3, false);
			ctx.fillStyle = '#333';
			ctx.fill();
			ctx.beginPath();
			ctx.arc(toPosition, 25, 10, -Math.TAU*0.2, Math.TAU*0.2, false);
			ctx.lineWidth = 3;
			ctx.strokeStyle = connectionColor;
			ctx.stroke();

			// Draw from synapse
			ctx.beginPath();
			ctx.arc(fromPosition, 25, 5, 0, Math.TAU, false);
			ctx.fillStyle = connectionColor;
			ctx.fill();

			// Draw PULSE
			if(pulseTimer>=0){
				
				var distance = Math.sqrt(dx*dx+dy*dy);
				var pulsePosition = distance*(1-pulseTimer/30);
				var pulseRadius = Math.sin(pulseTimer*1.5)+10;
				var pulseOffset = 25*Math.sin((pulseTimer/30)*Math.TAU/2);

				if(pulsePower>0){
					ctx.beginPath();
					ctx.arc(pulsePosition, pulseOffset, pulseRadius, 0,Math.TAU, false);
					ctx.fillStyle = 'rgba(255,255,255,0.5)';
					ctx.fill();
				}
				if(pulsePower>1){
					ctx.beginPath();
					ctx.arc(pulsePosition, pulseOffset, pulseRadius*1.5, 0,Math.TAU, false);
					ctx.fillStyle = 'rgba(255,255,255,0.3)';
					ctx.fill();
				}
				if(pulsePower>2){
					ctx.beginPath();
					ctx.arc(pulsePosition, pulseOffset, pulseRadius*2, 0,Math.TAU, false);
					ctx.fillStyle = 'rgba(255,255,255,0.3)';
					ctx.fill();
				}
				
			}

		}

		ctx.restore();

	};

}