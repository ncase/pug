function Sprite(config){

	var self = this;

	// ID
	self.id = config.id;
	Sprite[self.id] = self;

	// Drawing Properties
	self.x = config.x;
	self.y = config.y;
	self.width = config.width;
	self.height = config.height;
	self.spritesheet = new Image();
	self.spritesheet.src = config.spritesheet;
	self.frameWidth = config.frameWidth;
	self.frameHeight = config.frameHeight;
	self.frameTotal = config.frameTotal;
	self.currentFrame = 0;

	self.update = function(){};

	self.draw = function(ctx){
		
		ctx.save();
		
		// Translate
		ctx.translate(self.x,self.y);

		// Draw spritesheet
		var width = Math.floor(self.spritesheet.width/self.frameWidth);
		var sx = (self.currentFrame%width)*self.frameWidth;
		var sy = Math.floor(self.currentFrame/width)*self.frameHeight;
		var sw = self.frameWidth;
		var sh = self.frameHeight;
		var dx = 0;
		var dy = 0;
		var dw = self.width;
		var dh = self.height;
		ctx.drawImage(self.spritesheet, sx,sy,sw,sh, dx,dy,dw,dh);
		
		ctx.restore();

	};

}