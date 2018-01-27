function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale) {
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
    this.reverse = reverse;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    var scaleBy = this.scale || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
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
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
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
	var spritesheet = AM.getAsset("img/space_traveler.png");
	this.upAnimation = new Animation(spritesheet,           0,	448,	64, 64, 0.1, 	8, true,	0.75);
	this.downAnimation = new Animation(spritesheet,         0,	256,    64, 64, 0.1, 	8, true,	0.75);
	this.rightAnimation = new Animation(spritesheet,        0,	384,    64, 64, 0.1, 	8, true,	0.75);
	this.leftAnimation = new Animation(spritesheet,         0,	320,    64, 64, 0.1, 	8, true,	0.75);    
	this.upAttackAnimation = new Animation(spritesheet,     0,	0,		64, 64, 0.1, 	8, true,	0.75);    
	this.downAttackAnimation = new Animation(spritesheet,   0,	0,		64, 64, 0.1, 	8, true,	0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,	0,		64, 64, 0.1, 	8, true,	0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   0,	64,		64, 64, 0.1, 	8, true,	0.75);
	this.programAnimation = new Animation(spritesheet,      0,	192,	64, 64, 0.1, 	8, true,	0.75);
	this.dyingAnimation = new Animation(spritesheet,        0,	128,	64, 64, 0.01,	8, false,	0.75);  

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
	if(this.game.keys.up) {
		console.log("up");
		this.up = true;   
		this.down = false;
		this.left = false;
		this.right = false;
		this.y -= this.game.clockTick * this.speed;  
	} else if (this.game.keys.down) { 
		console.log("down");
		this.up = false;   
		this.down = true;
		this.left = false;
		this.right = false;
		this.y += this.game.clockTick * this.speed;
	} else if (this.game.keys.left) {
		console.log("left");
		this.up = false;   
		this.down = false;
		this.left = true;
		this.right = false;   
		this.x -= this.game.clockTick * this.speed;   
	} else if (this.game.keys.right) {
		console.log("right");
		this.up = false;   
		this.down = false;
		this.left = false;
		this.right = true;        
		this.x += this.game.clockTick * this.speed;      
	} 
	if(this.game.keys.attack) {
		console.log("attack");
		this.attack = true;
	} else {
		this.attack = false;
	}
	Entity.prototype.update.call(this); 
} 

Player.prototype.draw = function () {
 	if(this.dead) {
		this.dyingAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y); 
		Entity.prototype.draw.call(this); 
		this.removeFromWorld = true; 
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
	this.upAnimation = new Animation(spritesheet,           512,    64,     64, 64, 0.1, 4, true,  false,  0.75);
	this.downAnimation = new Animation(spritesheet,         0,      128,    64, 64, 0.1, 4, true,  false,  0.75);
	this.rightAnimation = new Animation(spritesheet,        512,    128,    64, 64, 0.1, 4, true,   false, 0.75);
	this.leftAnimation = new Animation(spritesheet,         256,    128,    64, 64, 0.1, 4, true, false,   0.75);    
	this.upAttackAnimation = new Animation(spritesheet,     0,      0,  64, 64, 0.1, 4, true, false,   0.75);    
	this.downAttackAnimation = new Animation(spritesheet,   256,    0,  64, 64, 0.1, 4, true, false,   0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,      64, 64, 64, 0.1, 4, true, false,   0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   512,    0,  64, 64, 0.1, 4, true, false,   0.75); 
	this.dyingAnimation = new Animation(spritesheet,        256,    64, 64, 64, 0.1, 4, false,  false,  0.75);    
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.attack = false;
	this.speed = 50;

	this.height = 64;
 
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

function Rummager(game, enemy) {  
	var spritesheet = AM.getAsset("img/rummager.png"); 
	this.upAnimation = new Animation(spritesheet,          0,    0,     64, 64, 0.1, 8, true,  false,  0.75);
	this.downAnimation = new Animation(spritesheet,        0,    64,   	64, 64, 0.1, 8, true,  false,  0.75);
	this.rightAnimation = new Animation(spritesheet,       0,    128,    64, 64, 0.1, 8, true,  false, 0.75);
	this.leftAnimation = new Animation(spritesheet,        0,    192,    64, 64, 0.1, 8, true,  false,   0.75);    
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.speed = 50;

	this.height = 64;
 
	this.angle = 2 * Math.PI;
	this.game = game;
	this.ctx = game.ctx;  
	this.dy = 0;
	this.dx = 0;
	this.distance = 0;
	this.enemy = enemy;
	Entity.call(this, game, Math.floor((Math.random() * this.game.width ) + 1), this.game.height);
}

Rummager.prototype = new Entity();
Rummager.prototype.constructor = Rummager;

Rummager.prototype.update = function () {
	if(this.enemy.dead) {
		mid = {
			x: -64,
			y: -64
		};
		this.game.moveTo(this, mid);

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

Rummager.prototype.draw = function () { 
    if (this.down) {
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

function RobotTier1(game, taskAsset) { //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, scale
	var spriteSheet = AM.getAsset("img/robotSpriteSheet1.png"); 
	this.upAnimation = new Animation(spriteSheet, 0, 512, 64, 64, 0.1, 8, true, false, 0.75);
	this.downAnimation = new Animation(spriteSheet, 0, 0, 64, 64, 0.1, 8, true, false, 0.75);
	this.rightAnimation = new Animation(spriteSheet, 0, 1152, 64, 64, 0.1, 11, true, false, 0.75);
	this.leftAnimation = new Animation(spriteSheet, 0, 1088, 64, 64, 0.1, 11, true, false, 0.75);
	
	this.up = false;
	this.down = true;
	this.left = false;
	this.right = false;
	
	this.repairUpAnimation = new Animation(spriteSheet, 512, 640, 64, 64, 0.1, 4, true, false, 0.75);
	this.repairDownAnimation = new Animation(spriteSheet, 256, 512, 64, 64, 0.1, 4, true, false, 0.75);
	this.repairRightAnimation = new Animation(spriteSheet, 0, 192, 64, 64, 0.1, 4, true, false, 0.75);
	this.repairLeftAnimation = new Animation(spriteSheet, 512, 704, 64, 64, 0.1, 4, true, false, 0.75);
	
	this.repair = false;
	
	this.gatherBerryUpAnimation = new Animation(spriteSheet, 256, 640, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherBerryDownAnimation = new Animation(spriteSheet, 0, 704, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherBerryRightAnimation = new Animation(spriteSheet, 512, 320, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherBerryLeftAnimation = new Animation(spriteSheet, 512, 384, 64, 64, 0.1, 4, true, false, 0.75);
	
	this.gatherBerry = false;
	
	this.gatherScrapUpAnimation = new Animation(spriteSheet, 512, 448, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherScrapDownAnimation = new Animation(spriteSheet, 0, 512, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherScrapRightAnimation = new Animation(spriteSheet, 512, 192, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherScrapLeftAnimation = new Animation(spriteSheet, 512, 512, 64, 64, 0.1, 4, true, false, 0.75);
	
	this.gatherScrap = false;
	//add rest
	
	this.taskAsset = taskAsset;

	this.dead = false; 
	this.life = 200; //robots life?

	this.speed = 75;
	this.angle = 2 *Math.PI;
	this.dy = 0;
	this.dx = 0;
	this.distance = 0;
	this.game = game;
	this.ctx = game.ctx; 
	
	Entity.call(this, game, Math.floor(this.game.width / 2), Math.floor(this.game.height / 2));
}

RobotTier1.prototype = new Entity();
RobotTier1.prototype.constructor = RobotTier1;

RobotTier1.prototype.update = function(){
	

	this.game.moveTo(this, this.taskAsset);
	if(Math.floor(this.distance) < 32){
		this.repair = true;
	} else {  
		this.repair = false; 
				
		this.x += this.dx * this.game.clockTick * this.speed;
		this.y += this.dy * this.game.clockTick * this.speed;

		this.dx = Math.floor(this.dx);
		this.dy = Math.floor(this.dy);
		
 		if(this.dx ===this.dy) { 
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
	Entity.prototype.update.call(this);  
}

RobotTier1.prototype.draw = function(){
	
	if(this.gatherBerry){
		if(this.down){
			this.gatherBerryDownAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else if(this.left){
			this.gatherBerryLeftAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);		
		} else if(this.right){
			this.gatherBerryRightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);		
		}else{
			this.gatherBerryUpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);		
		}
	} else if( this.repair){
		if(this.down){
			this.repairDownAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		} else if(this.left){
			this.repairLeftAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);		
		} else if(this.right){
			this.repairRightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);		
		}else{
			this.repairUpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);		
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


// Environment Entities
function Foliage(game) {
	this.game = game;   
	this.ctx = game.ctx;    
	this.spritesheet = "img/tree.png";	
	this.x = 0;
	this.y = 0;
	if(this.spritesheet === "img/tree.png") {
		this.height = 124;
	}
	this.height = 50;
	this.game.forestGen(this);
	Entity.call(this, game, this.x, this.y);
}

Foliage.prototype = new Entity();
Foliage.prototype.constructor = Foliage;

Foliage.prototype.update = function () {
}

Foliage.prototype.draw = function (ctx) {
	ctx.drawImage(AM.getAsset(this.spritesheet), this.x, this.y);
	Entity.prototype.draw.call(this);
}

// Environment Entities
function Building(game) {
	this.game = game;   
	this.ctx = game.ctx;    
	this.spriteSheet = "img/building1.png";
	this.x = 0;
	this.y = 0;
 
 	this.height = 125;
	
	this.game.cityGen(this);
	Entity.call(this, game, this.x, this.y);
}

Building.prototype = new Entity();
Building.prototype.constructor = Building;

Building.prototype.update = function () {
}

Building.prototype.draw = function (ctx) {
	ctx.drawImage(AM.getAsset(this.spritesheet), this.x, this.y);
	Entity.prototype.draw.call(this);
}


function SpaceShip(game) {
	this.spritesheet = "img/spaceship.png";
	this.game = game;   
	this.ctx = game.ctx;     
 	this.x =  Math.floor(this.game.width / 2);
 	this.y =  Math.floor(this.game.height / 2);
 	this.height = 156;
	Entity.call(this, game,this.x - 150 , this.y - this.height /2);

 }

SpaceShip.prototype = new Entity();
SpaceShip.prototype.constructor = SpaceShip;

SpaceShip.prototype.update = function () {
}

SpaceShip.prototype.draw = function (ctx) {
	ctx.drawImage(AM.getAsset(this.spritesheet), this.x, this.y);
	Entity.prototype.draw.call(this);
}

var AM = new AssetManager(); 

AM.queueDownload("img/map.png");
AM.queueDownload("img/space_traveler.png");
AM.queueDownload("img/scavenger.png");  
AM.queueDownload("img/tree.png"); 
AM.queueDownload("img/bush.png"); 
AM.queueDownload("img/building1.png"); 
AM.queueDownload("img/building2.png"); 
AM.queueDownload("img/building3.png"); 
AM.queueDownload("img/spaceship.png");
AM.queueDownload("img/robotSpriteSheet1.png");
AM.queueDownload("img/rummager.png");

AM.downloadAll(function () {
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");

	var gameEngine = new GameEngine(); 

	gameEngine.init(ctx);
	gameEngine.start()


	var numTrees = Math.floor(Math.random() * 21) + 30;
	var numBuildings = Math.floor(Math.random() * 6) + 10;

	var player = new Player(gameEngine);
	var map = new Background(gameEngine);
	var scav = new Scavenger(gameEngine, player); 
	var spaceship = new SpaceShip(gameEngine); 
	var robot = new RobotTier1(gameEngine, spaceship);
	var rummager = new Rummager(gameEngine, robot);

	gameEngine.addEntity(map);  

	for(var i = 0; i < numTrees; i++) {
		gameEngine.addEntity(new Foliage(gameEngine));     
	}

	for(var i = 0; i < numBuildings; i++) {
		gameEngine.addEntity(new Building(gameEngine));     
	}

	gameEngine.addEntity(spaceship);   

	gameEngine.addEntity(scav); 

	gameEngine.addEntity(robot);     
	gameEngine.addEntity(rummager);     
	gameEngine.addEntity(player);  


	console.log("All Done!");
});