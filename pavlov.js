/***

- EXPLICIT PROMPT, try before reading, and mess fuck around
- Copy Note: LESS VIVID neural firing for associative
- Two more lil' questions: other way, both

***/
Experiment.setInformation({
	title: "PAVLOV'S PUG",
	description: "Meet Puddles. Her favorite food is chicken. She drools <i>waterfalls</i> whenever she smells chicken. "+
		"Play around! Experiment with the bell & chicken-dispenser-button.",
	qa:[
		{
			q:"Ring the bell. What happens?",
			a:"Puddles hears the bell, but her 'bell' neuron isn't connected to anything yet. "+
				"So in response, she does nothing, and thinks nothing."
		},
		{
			q:"How does Puddles respond when you give her some chicky-chicky?",
			a:"Yes, she just ate the whole thing, bones and all. Puddles is a beast. "+
				"But you'll also notice that when the 'meat' neuron fires, "+
				"it triggers the connected 'drool' neuron. This is an involuntary, natural response."
		},
		{
			q:"What happens when you ring the bell, then immediately give Puddles meat?",
			a:"You can start to see the 'bell' neuron start to connect to the 'meat' neuron! "+
				"Cells that fire together, wire together. "+
				"Do this a couple more times, and they'll connect - storing it in Puddles's long-term memory."
		},
		{
			q:"After Puddles learns bell&#8594;meat, what happens when you ring the bell?",
			a:"Puddles drools involuntarily at the sound of the bell, <i>without</i> seeing the meat. "+
				"While before, Puddles did not react to the bell at all. "+
				"(Note that the 'drool' neuron fires less intensely than if Puddles is directly exposed to meat) "+
				"This is the crucial lesson that Ivan Pavlov learnt in his original experiments, "+
				"and it's called Classical Conditioning. "
		},
		{
			q:"Hit the reset button. Make Puddles learn that meat&#8594;bell instead. What happens?",
			a:"Now when you ring the bell, Puddles will <i>not</i> drool. "+
				"But if you give Puddles meat, she'll expect the bell ringing. "+
				"She probably thinks it's some kind of meal-accompanying music, not a dinner announcement. "+
				"This is something else Pavlov found - that doing conditioning backwards has no effect, "+
				"and that order of events matters."
		},
		{
			q:"What if you make Puddles learn <i>both</i> that bell&#8594;meat & meat&#8594;bell?",
			a:"Ring the bell or give her meat, and the neural signal will circle around for a while. "+
				"The memory sticks around <i>longer</i>. "+
				"And that's a phenomenon you may have noticed in your own life! "+
				"The more senses you involve in something, the more vivid your later memories of it will be, "+
				"as it was in Puddles right there."
		}
	]
});

function reset(){
	
	window.neurons = [];
	window.connections = [];
	window.sprites = [];

	Experiment.setBrain({
		neurons:[
			{
				id:"bell", x:170, y:100,
				icon:"pavlov/icons/bell.png"
			},
			{
				id:"meat", x:320, y:225,
				icon:"pavlov/icons/meat.png"
			},
			{
				id:"drool", x:470, y:100,
				icon:"pavlov/icons/drool.png"
			}
		],
		connections:[
			{from:"meat", to:"drool", strength:1},
			{from:"bell", to:"meat", strength:0},
			{from:"meat", to:"bell", strength:0}
			//{from:"bell", to:"drool", strength:0}
		]
	});

	sprites.push(new Bell());
	sprites.push(new Meat());
	sprites.push(new Pug());

}

////////////////////

// And then, manually setting up the things you can click,
// and what they do, how they act,
// tick-based thinking.
// events called, weird stuff.

function Bell(){

	var self = this;
	Sprite.call(self,{

		id: "bell",

		x:-10, y:-16, width:175, height:440,
		spritesheet: "pavlov/sprites/bell.png",
		frameWidth:200, frameHeight:495,
		frameTotal:13

	});

	self.playingMode = 0;

	self.ring = function(){
		publish("/click/bell");
		self.playingMode = 1;
		Neuron.bell.pulse(4);
	};

	self.update = function(){
		if(self.playingMode==1){
			self.currentFrame = (self.currentFrame+1);
		}
		if(self.currentFrame==self.frameTotal){
			self.playingMode=0;
			self.currentFrame=0;
		}
	};

}

function Meat(){

	var self = this;
	Sprite.call(self,{

		id: "meat",

		x:444, y:-206, width:208, height:714,
		spritesheet: "pavlov/sprites/meat.png",
		frameWidth:200, frameHeight:685,
		frameTotal:37

	});

	self.playingMode = 0;

	self.click = function(){
		publish("/click/meat");
		if(self.playingMode==0){
			self.playingMode = 1;
		}
	};
	self.eat = function(){
		if(self.playingMode==2){
			self.playingMode = 3;
			self.currentFrame=29;
		}
	}

	self.isOut = false;
	self.update = function(){
		
		self.isOut = (self.playingMode==2);

		if(self.playingMode==1){
			self.currentFrame = (self.currentFrame+1);
			if(self.currentFrame==15){
				Neuron.meat.pulse(4);
			}
			if(self.currentFrame==28){
				self.playingMode=2;
			}
		}

		if(self.playingMode==3){
			self.currentFrame = (self.currentFrame+1);
			if(self.currentFrame==self.frameTotal){
				self.currentFrame=0;
				self.playingMode=0;
			}
		}

	};

}

function Pug(){

	var self = this;
	Sprite.call(self,{

		id: "pug",

		x:-13, y:260, width:666, height:254,
		spritesheet: "pavlov/sprites/pug.png",
		frameWidth:700, frameHeight:267,
		frameTotal:5

	});

	self.timer = -1;

	subscribe("/click/bell", function(msg){
		if(self.currentFrame!=0) return;
        self.currentFrame = 1;
        self.timer = 10;
    });
	subscribe("/neuron/meat", function(msg){
		if(self.currentFrame!=0) return;
        self.currentFrame = 2;
        self.timer = 10;
    });
    subscribe("/neuron/drool", function(msg){
        self.currentFrame = 3;
        self.timer = 30;
    });

	self.update = function(){
		if(self.timer>0){
			self.timer--;
			if(self.timer==0){
				if(self.currentFrame==1){
					self.currentFrame=0;
					self.timer = -1;
					return;
				}
				if(self.currentFrame==2){
					self.currentFrame=0;
					self.timer = -1;
					return;
				}
				if(self.currentFrame==3){
					if(Sprite.meat.isOut){
						self.currentFrame=4;
						self.timer = 20;
					}else{
						self.currentFrame=0;
						self.timer = -1;
					}
					return;
				}
				if(self.currentFrame==4){
					if(Sprite.meat.isOut){
						Sprite.meat.eat();
					}
					self.currentFrame=0;
					self.timer = -1;
					return;
				}
			}
		}
	};

}

///////////

reset();