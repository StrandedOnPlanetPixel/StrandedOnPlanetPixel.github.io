
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, scale) {
	this.spriteSheet = spriteSheet;
	this.startX = startX;
	this.startY = startY;
	this.frameWidth = frameWidth;
	this.frameDuration = frameDuration;
	this.frameHeight = frameHeight;
	this.frames = frames;
	this.totalTime = frameDuration * frames;
	this.elapsedTime = 0;
	this.loop = loop;
	this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
	this.elapsedTime += tick;
	if (this.isDone()) { 
		if (this.loop)
			this.elapsedTime = 0;
	}
	var frame = this.currentFrame();
	var xindex = 0;
	var yindex = 0;
	xindex = frame % this.sheetWidth;
	yindex = Math.floor(frame / this.sheetWidth);

	var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
	var vindex = 0;
	if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
		index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
		vindex++;
	}
	while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
		index -= Math.floor(this.spriteSheet.width / this.frameWidth);
		vindex++;
	}

	var locX = x;
	var locY = y;
	var offset = vindex === 0 ? this.startX : 0;
	ctx.drawImage(this.spriteSheet,
				  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
				  this.frameWidth, this.frameHeight,
				  locX, locY,
				 this.frameWidth * this.scale,
				 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
	return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
	return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game) {
	Entity.call(this, game, 0, 0); 
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
	ctx.drawImage(AM.getAsset("img/map.png"), 0, 0);
	Entity.prototype.draw.call(this);
}


function Player(game) { //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, scale
	var spritesheet = AM.getAsset("img/scavenger.png");
	this.upAnimation = new Animation(spritesheet,           512,    64,     64, 64, 0.1, 4, true,   0.75);
	this.downAnimation = new Animation(spritesheet,         0,      128,    64, 64, 0.1, 4, true,   0.75);
	this.rightAnimation = new Animation(spritesheet,        512,    128,    64, 64, 0.1, 4, true,   0.75);
	this.leftAnimation = new Animation(spritesheet,         256,    128,    64, 64, 0.1, 4, true,   0.75);    
	this.upAttackAnimation = new Animation(spritesheet,     0,      0,  	64, 64, 0.1, 4, true,   0.75);    
	this.downAttackAnimation = new Animation(spritesheet,   256,    0,  	64, 64, 0.1, 4, true,   0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,      64, 	64, 64, 0.1, 4, true,   0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   512,    0,  	64, 64, 0.1, 4, true,   0.75);  
	this.deadAnimation = new Animation(spritesheet,        	448,    64, 	64, 64, 0.1, 1, true,   0.75);    
	this.up = false;
	this.down = true;
	this.left = false;
	this.right = false;
	this.attack = false;
	this.dead = false; 
	this.life = 200;

	this.speed = 150;
	this.game = game;
	this.ctx = game.ctx; 
	Entity.call(this, game, Math.floor(this.game.width / 2), Math.floor(this.game.height / 2));
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {
	if(!this.dead) {
		if(this.game.keys.up) {
			this.up = true;   
			this.down = false;
			this.left = false;
			this.right = false;
			this.y -= this.game.clockTick * this.speed;  
		} else if (this.game.keys.down) { 
			this.up = false;   
			this.down = true;
			this.left = false;
			this.right = false;
			this.y += this.game.clockTick * this.speed;
		} else if (this.game.keys.left) {
			this.up = false;   
			this.down = false;
			this.left = true;
			this.right = false;   
			this.x -= this.game.clockTick * this.speed;   
		} else if (this.game.keys.right) {
			this.up = false;   
			this.down = false;
			this.left = false;
			this.right = true;        
			this.x += this.game.clockTick * this.speed;      
		} 
		if(this.game.keys.attack) {
			this.attack = true;
		} else {
			this.attack = false;
		}
	}
	Entity.prototype.update.call(this); 
} 

Player.prototype.draw = function () {
 	if(this.dead) {
		this.deadAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y); 
	} else if(this.attack) {
		if (this.down) {
			this.downAttackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else if (this.left) {
			this.leftAttackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else if (this.right) {
			this.rightAttackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else {
			this.upAttackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);  
		}
	} else if (this.down) {
		this.downAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	} else if (this.left) {
		this.leftAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	} else if (this.right) {
		this.rightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	} else {
		this.upAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);  
	} 
	
	Entity.prototype.draw.call(this); 	 
}

function Scavenger(game, enemy) {  
	var spritesheet = AM.getAsset("img/scavenger.png");
				 //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, scale
	this.upAnimation = new Animation(spritesheet,           512,    64,     64, 64, 0.1, 4, true,   0.75);
	this.downAnimation = new Animation(spritesheet,         0,      128,    64, 64, 0.1, 4, true,   0.75);
	this.rightAnimation = new Animation(spritesheet,        512,    128,    64, 64, 0.1, 4, true,   0.75);
	this.leftAnimation = new Animation(spritesheet,         256,    128,    64, 64, 0.1, 4, true,   0.75);    
	this.upAttackAnimation = new Animation(spritesheet,     0,      0,  64, 64, 0.1, 4, true,   0.75);    
	this.downAttackAnimation = new Animation(spritesheet,   256,    0,  64, 64, 0.1, 4, true,   0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,      64, 64, 64, 0.1, 4, true,   0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   512,    0,  64, 64, 0.1, 4, true,   0.75); 
	this.dyingAnimation = new Animation(spritesheet,        256,    64, 64, 64, 0.1, 4, false,   0.75);    
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.attack = false;
	this.speed = 50;
 
	this.angle = 2 * Math.PI;
	this.game = game;
	this.ctx = game.ctx;  
	this.dy = 0;
	this.dx = 0;
	this.distance = 0;
	this.enemy = enemy;
	Entity.call(this, game, Math.floor((Math.random() * this.game.width ) + 1), this.game.height);
}

Scavenger.prototype = new Entity();
Scavenger.prototype.constructor = Scavenger;

Scavenger.prototype.update = function () {
	if(this.enemy.dead) {
		mid = {
			x: -64,
			y: -64
		};
		this.game.moveTo(this, mid);
	} else {

		this.game.moveTo(this, this.enemy);
		 
		if(Math.floor(this.distance) < 32) {
			this.attack = true;
			this.enemy.life--;  
			if(this.enemy.life < 0) { 
				this.enemy.dead = true;
				this.attack = false;
			}
		} else {  
			this.attack = false;
	
			this.x += this.dx * this.game.clockTick * this.speed;
			this.y += this.dy * this.game.clockTick * this.speed;

			this.dx = Math.floor(this.dx);
			this.dy = Math.floor(this.dy);

			if(this.dx === this.dy) { 
				if(this.dx < 0) {
					this.left = true;
					this.right = false; 
					this.up = false;
					this.down = false;
				} else {
					this.left = false;
					this.right = true;
					this.up = false;
					this.down = false;
				} 
			} else if (this.dx > this.dy) {	 
				if(this.dx < 0) {
					this.down = true;
					this.up = false;
					this.left = false;
					this.right = false; 
				} else {
					this.down = false;
					this.up = true;
					this.left = false;
					this.right = false; 
				} 
		 	} else { 

				if(this.dy < 0) {
					this.down = false;
					this.up = true;
					this.left = false;
					this.right = false; 
				} else {
					this.down = true;
					this.up = false;
					this.left = false;
					this.right = false; 
				} 
		 	}
		} 
	}

	
	Entity.prototype.update.call(this);  
} 

Scavenger.prototype.draw = function () { 
 	if(this.attack) {
		if (this.down) {
			this.downAttackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else if (this.left) {
			this.leftAttackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else if (this.right) {
			this.rightAttackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else {
			this.upAttackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);  
		}
	} else if (this.down) {
		this.downAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	} else if (this.left) {
		this.leftAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	} else if (this.right) {
		this.rightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	} else {
		this.upAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);  
	}
	Entity.prototype.draw.call(this); 
}

var AM = new AssetManager(); 

AM.queueDownload("img/map.png");
AM.queueDownload("img/scavenger.png");  

AM.downloadAll(function () {
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");

	var gameEngine = new GameEngine(); 

	gameEngine.init(ctx);
	gameEngine.start()


	var player = new Player(gameEngine);
	var map = new Background(gameEngine);
	var scav = new Scavenger(gameEngine, player); 

	gameEngine.addEntity(map);  
	gameEngine.addEntity(player);  
	gameEngine.addEntity(scav);     

	console.log("All Done!");
});