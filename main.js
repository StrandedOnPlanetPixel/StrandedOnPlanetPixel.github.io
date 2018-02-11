
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

Animation.prototype.drawFrame = function (tick, ctx, x, y, radius) {
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

    var locX = x - radius;
    var locY = y - radius;
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

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function collide(ent, otherEnt) {
    return distance(ent, otherEnt) < ent.radius + otherEnt.radius;
};

function collideLeft(ent) {
    return (ent.x - ent.radius) < 0;
};

function collideRight(ent) {
    return (ent.x + ent.radius) > width;
};

function collideTop(ent) {
    return (ent.y - ent.radius) < 0;
};

function collideBottom(ent) {
    return (ent.y + ent.radius) > height;
};

function moveEntityToTarget(ent, target) { 
	var dx = target.x - ent.x;
	var dy = target.y - ent.y; 
	var distance = Math.sqrt(dx * dx + dy * dy);
	 
	if(distance) {  
		dx /= distance;
		dy /= distance;
	}   
 	if(dx === dy) { 
		if(dx < 0) {
			ent.animation = ent.leftAnimation;
		} else {
			ent.animation = ent.rightAnimation;
		} 
	} else {	 
		if(dx < 0 || dy > 0) {
			ent.animation = ent.downAnimation;
		} else {				
			ent.animation = ent.upAnimation;
		}
 	} 
	ent.x += dx * ent.game.clockTick * ent.speed;
	ent.y += dy * ent.game.clockTick * ent.speed;
}

function attack(ent) {
	if(this.dx === this.dy) { 
		if(this.dx < 0) {
			this.animation = this.leftAttackAnimation;
		} else {
			this.animation = this.rightAttackAnimation;
		} 
	} else {	 
		if(this.dx < 0 || this.dy > 0) {
			this.animation = this.downAttackAnimation;
		} else {				
			this.animation = this.upAttackAnimation;

		}
 	}  
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


function Player(game) {
	var spritesheet = AM.getAsset("img/space_traveler.png");
	this.animation = new Animation(spritesheet,             0,	448,	64, 64, 0.1, 	8, true,	false,	0.75);
	this.stillAnimation = new Animation(spritesheet,        0,	256,    64, 64, 0.1, 	1, true,	false,	0.75);
	this.upAnimation = new Animation(spritesheet,           0,	448,	64, 64, 0.1, 	8, true,	false,	0.75);
	this.downAnimation = new Animation(spritesheet,         0,	256,    64, 64, 0.1, 	8, true,	false,	0.75);
	this.rightAnimation = new Animation(spritesheet,        0,	384,    64, 64, 0.1, 	8, true,	false,	0.75);
	this.leftAnimation = new Animation(spritesheet,         0,	320,    64, 64, 0.1, 	8, true,	false,	0.75);    
	this.upAttackAnimation = new Animation(spritesheet,     0,	0,		64, 64, 0.1, 	8, true,	false,	0.75);    
	this.downAttackAnimation = new Animation(spritesheet,   0,	0,		64, 64, 0.1, 	8, true,	false,	0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,	0,		64, 64, 0.1, 	8, true,	false,	0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   0,	64,		64, 64, 0.1, 	8, true,	true,	0.75);
	this.programAnimation = new Animation(spritesheet,      0,	192,	64, 64, 0.1, 	8, true,	false,	0.75);
	this.dyingAnimation = new Animation(spritesheet,        0,	128,	64, 64, 0.001,	8, false,	false,	0.75); 
	this.deadAnimation = new Animation(spritesheet,        448,	128,	64, 64, 0.01,	1, true,	false,	0.75);  

	this.game = game;
	this.ctx = game.ctx; 
	this.radius = 24;  
	Entity.call(this, game, width / 2, height / 2 ); 
	this.x += this.radius;
	this.y += this.radius;

	// The radius is the spritesheet height divided by two?
	this.lives = 200;
	this.speed = 150;
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {
	if (collideLeft(this) || collideRight(this)) { 
        if (collideLeft(this)) this.x = this.radius;
        if (collideRight(this)) this.x = width - this.radius; 
    }

    if (collideTop(this) || collideBottom(this)) {
        if (collideTop(this)) this.y = this.radius;
        if (collideBottom(this)) this.y = height - this.radius; 
    }
    
  	if(this.lives > 0) {
		if(this.game.keys.attack) {
		 	if(this.game.keys.up) {
		 		this.animation = this.upAttackAnimation; 
			} else if (this.game.keys.down) {  
		 		this.animation = this.downAttackAnimation; 
			} else if (this.game.keys.left) {
		 		this.animation = this.leftAttackAnimation;    
			} else if (this.game.keys.right) {
		 		this.animation = this.rightAttackAnimation;       
			} 
		} else {
			if(this.game.keys.up) {
		 		this.animation = this.upAnimation;
		 		this.y -= this.game.clockTick * this.speed;  
			} else if (this.game.keys.down) {  
		 		this.animation = this.downAnimation;
				this.y += this.game.clockTick * this.speed;
			} else if (this.game.keys.left) {
		 		this.animation = this.leftAnimation; 
				this.x -= this.game.clockTick * this.speed;   
			} else if (this.game.keys.right) {
		 		this.animation = this.rightAnimation;    
				this.x += this.game.clockTick * this.speed;      
			} else {
		 		this.animation = this.stillAnimation;    
			}
		} 
		if(this.game.keys.program) {
	 		this.animation = this.programAnimation;
		}  
	} else {
		this.animation = this.deadAnimation;
	} 
	Entity.prototype.update.call(this); 
} 

Player.prototype.draw = function () {
 	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius); 
	Entity.prototype.draw.call(this); 
}

function Alien(game, enemy) {  
	var spritesheet = AM.getAsset("img/alien.png");
	this.animation = new Animation(spritesheet,             256,    192,     64, 64, 0.1, 4, true,  false,  0.75);
	this.upAnimation = new Animation(spritesheet,           256,    192,     64, 64, 0.1, 4, true,  false,  0.75);
	this.downAnimation = new Animation(spritesheet,         0,     64,    64, 64, 0.1, 4, true,  false,  0.75);
	this.rightAnimation = new Animation(spritesheet,        0,   256,    64, 64, 0.1, 4, true,   false, 0.75);
	this.leftAnimation = new Animation(spritesheet,         256,   256,    64, 64, 0.1, 4, true, false,   0.75);    
	this.upAttackAnimation = new Animation(spritesheet,     0,    128,  64, 64, 0.1, 4, true, false,   0.75);    
	this.downAttackAnimation = new Animation(spritesheet,   0,    	128,  64, 64, 0.1, 4, true, false,   0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  256,   64, 64, 64, 0.1, 4, true, false,   0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   0,    192,  64, 64, 0.1, 4, true, false,   0.75); 
	this.dyingAnimation = new Animation(spritesheet,        0,    0, 64, 64, 0.1, 8, false,  false,  0.75);    
	
	this.game = game;
	this.ctx = game.ctx; 
	this.enemy = enemy;
	Entity.call(this, game, Math.random() * width, height);
	this.radius = 24;
	this.lives = 200;
	this.speed = 50;
	this.visualRadius = 200;
}

Alien.prototype = new Entity();
Alien.prototype.constructor = Alien;

Alien.prototype.update = function () {
	if (collideLeft(this) || collideRight(this)) { 
        if (collideLeft(this)) this.x = this.radius;
        if (collideRight(this)) this.x = width - this.radius; 
    }

    if (collideTop(this) || collideBottom(this)) {
        if (collideTop(this)) this.y = this.radius;
        if (collideBottom(this)) this.y = height - this.radius; 
    }

	for (var i = 0; i < this.game.friendlyEntities.length; i++) {
        var ent = this.game.friendlyEntities[i];
        if (this != ent && collide(this, ent)) {
	    	this.animation = this.downAttackAnimation;
        }  
    }

    var closestEnt = this.game.friendlyEntities[0];
    for (var i = 0; i < this.game.friendlyEntities.length; i++) {
       	var ent = this.game.friendlyEntities[i];
        if (ent != this && collide(this, { x: ent.x, y: ent.y, radius: this.visualRadius })) {
			var dist = distance(this, ent); 
			if(dist < distance(this, closestEnt)) {
				closestEnt = ent;
			}
        }  
    }

	this.game.moveTo(this, closestEnt);


	if(collide(this, closestEnt)) {
 		console.log("Alien attacking " + closestEnt);
 		attack(this);
	} else {
	  	moveEntityToTarget(this, closestEnt);
	} 
	Entity.prototype.update.call(this);  
} 

Alien.prototype.draw = function () { 
 	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius); 
	Entity.prototype.draw.call(this); 
}

function Scavenger(game, enemy) {  
	var spritesheet = AM.getAsset("img/scavenger.png");
	this.animation = new Animation(spritesheet,             512,    64,     64, 64, 0.1, 4, true,  false,  0.75);
	this.upAnimation = new Animation(spritesheet,           512,    64,     64, 64, 0.1, 4, true,  false,  0.75);
	this.downAnimation = new Animation(spritesheet,         0,      128,    64, 64, 0.1, 4, true,  false,  0.75);
	this.rightAnimation = new Animation(spritesheet,        512,    128,    64, 64, 0.1, 4, true,   false, 0.75);
	this.leftAnimation = new Animation(spritesheet,         256,    128,    64, 64, 0.1, 4, true, false,   0.75);    
	this.upAttackAnimation = new Animation(spritesheet,     0,      0,  64, 64, 0.1, 4, true, false,   0.75);    
	this.downAttackAnimation = new Animation(spritesheet,   256,    0,  64, 64, 0.1, 4, true, false,   0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,      64, 64, 64, 0.1, 4, true, false,   0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   512,    0,  64, 64, 0.1, 4, true, false,   0.75); 
	this.dyingAnimation = new Animation(spritesheet,        256,    64, 64, 64, 0.1, 4, false,  false,  0.75);    

	this.game = game;
	this.ctx = game.ctx; 
	this.enemy = enemy;
	Entity.call(this, game, Math.random() * width, height);
	this.radius = 24;
	this.lives = 200;
	this.speed = 50;
	this.visualRadius = 200;
	Entity.call(this, game, Math.floor((Math.random() * this.game.width ) + 1), this.game.height);
}

Scavenger.prototype = new Entity();
Scavenger.prototype.constructor = Scavenger;

Scavenger.prototype.update = function () {
	if (collideLeft(this) || collideRight(this)) { 
        if (collideLeft(this)) this.x = this.radius;
        if (collideRight(this)) this.x = width - this.radius; 
    }

    if (collideTop(this) || collideBottom(this)) {
        if (collideTop(this)) this.y = this.radius;
        if (collideBottom(this)) this.y = height - this.radius; 
    }

	for (var i = 0; i < this.game.friendlyEntities.length; i++) {
        var ent = this.game.friendlyEntities[i];
        if (this != ent && collide(this, ent)) {
	    	this.animation = this.downAttackAnimation;
        }  
    }

    var closestEnt = this.game.friendlyEntities[0];
    for (var i = 0; i < this.game.friendlyEntities.length; i++) {
       	var ent = this.game.friendlyEntities[i];
        if (ent != this && collide(this, { x: ent.x, y: ent.y, radius: this.visualRadius })) {
			var dist = distance(this, ent); 
			if(dist < distance(this, closestEnt)) {
				closestEnt = ent;
			}
        }  
    }

	this.game.moveTo(this, closestEnt);

	if(collide(this, closestEnt)) {
 		console.log("Scavenger attacking " + closestEnt);
 		attack(this); 
	} else {
		moveEntityToTarget(this, closestEnt);
	} 
	Entity.prototype.update.call(this);  
} 

Scavenger.prototype.draw = function () { 
 	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius); 
	Entity.prototype.draw.call(this); 
}

function Rummager(game, enemy) {  
	var spritesheet = AM.getAsset("img/rummager.png"); 
	this.leftAnimation = new Animation(spritesheet,          0,    0,     64, 64, 0.1, 8, true,  false,  0.75);
	this.rightAnimation = new Animation(spritesheet,        0,    64,   	64, 64, 0.1, 8, true,  false,  0.75);
	this.upAnimation = new Animation(spritesheet,       0,    128,    64, 64, 0.1, 8, true,  false, 0.75);
	this.downAnimation = new Animation(spritesheet,        0,    192,    64, 64, 0.1, 8, true,  false,   0.75);    
	
	this.game = game;
	this.ctx = game.ctx;  
	Entity.call(this, game, Math.random() * width, height);
	this.radius = 24;
	this.lives = 200;
	this.speed = 50;
	this.visualRadius = 200;
	this.lastBulletTime = 0;

	Entity.call(this, game, Math.floor((Math.random() * this.game.width ) + 1), this.game.height);
}

Rummager.prototype = new Entity();
Rummager.prototype.constructor = Rummager;

Rummager.prototype.update = function () {
	if (collideLeft(this) || collideRight(this)) { 
        if (collideLeft(this)) this.x = this.radius;
        if (collideRight(this)) this.x = width - this.radius; 
    }

    if (collideTop(this) || collideBottom(this)) {
        if (collideTop(this)) this.y = this.radius;
        if (collideBottom(this)) this.y = height - this.radius; 
    }

	for (var i = 0; i < this.game.friendlyEntities.length; i++) {
        var ent = this.game.friendlyEntities[i];
        if (this != ent && collide(this, ent)) {
	    	this.animation = this.downAttackAnimation;
        }  
    }

    var closestEnt = this.game.friendlyEntities[0];
    for (var i = 0; i < this.game.friendlyEntities.length; i++) {
       	var ent = this.game.friendlyEntities[i];
        if (ent != this && collide(this, { x: ent.x, y: ent.y, radius: this.visualRadius })) {
			var dist = distance(this, ent); 
			if(dist < distance(this, closestEnt)) {
				closestEnt = ent;
			}
        }  
    }

	if(collide(this, {x: closestEnt.x, y: closestEnt.y, radius: this.visualRadius})) {
 		this.animation = this.shootAnimation;

 		if(!this.lastBulletTime) {
			this.game.addEntity(new Bullet(this.game, this, closestEnt));
	 		this.lastBulletTime = this.game.timer.gameTime; 
 		} else if(this.lastBulletTime < this.game.timer.gameTime - 3) {
	 	 	console.log("Rummager shoots at " + closestEnt);
			this.game.addEntity(new Bullet(this.game, this, closestEnt));
	 		this.lastBulletTime = this.game.timer.gameTime; 
	 	}
	} else {
		moveEntityToTarget(this, closestEnt);
	} 
	Entity.prototype.update.call(this);  
} 

Rummager.prototype.draw = function () { 
    if (this.down) {
		this.downAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	} else if (this.left) {
		this.leftAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	} else if (this.right) {
		this.rightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	} else {
		this.upAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);  
	}
	Entity.prototype.draw.call(this); 
}

function Bullet(game, parent, target) {
	var spriteSheet = AM.getAsset("img/bullet.png");
	this.animation = new Animation(spriteSheet, 0, 0, 16, 16, 0.1, 1, true, false, 0.75);
	this.targetLocation = {x: target.x + width, y: target.y + height, radius: target.radius}; 
	this.target = target;  
	this.game = game;
	this.ctx = game.ctx; 
	Entity.call(this, game, parent.x, parent.y);
 	this.radius = 8; 
	this.speed = 50;
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
	if (collideLeft(this) || collideRight(this)) {  
        this.removeFromWorld = true;
    }

    if (collideTop(this) || collideBottom(this)) { 
        this.removeFromWorld = true;
    }

    if(collide(this, this.target)) {
    	this.target.lives -= 5;
        this.removeFromWorld = true;
    } else { 
    	var dx = this.targetLocation.x - this.x;
		var dy = this.targetLocation.y - this.y; 
		var distance = Math.sqrt(dx * dx + dy * dy);
		 
		if(distance) {  
			dx /= distance;
			dy /= distance;
		}    
		this.x += dx * this.game.clockTick * this.speed;
		this.y += dy * this.game.clockTick * this.speed;
    }
	Entity.prototype.update.call(this);  			
}
Bullet.prototype.draw = function() {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);  
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
	this.radius = 24;
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
			this.gatherBerryDownAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
		} else if(this.left){
			this.gatherBerryLeftAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);		
		} else if(this.right){
			this.gatherBerryRightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);		
		}else{
			this.gatherBerryUpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);		
		}
	} else if(this.repair){
		if(this.down){
			this.repairDownAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
		} else if(this.left){
			this.repairLeftAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);		
		} else if(this.right){
			this.repairRightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);		
		}else{
			this.repairUpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);		
		}
	} else if (this.down) {
		this.downAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y,this.radius);
	} else if (this.left) {
		this.leftAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	} else if (this.right) {
		this.rightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	} else {
		this.upAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);  
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

var height = null;
var width = null;
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
AM.queueDownload("img/alien.png");
AM.queueDownload("img/bullet.png");

AM.downloadAll(function () {
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");

	height = canvas.height;
	width = canvas.width;

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
	var alien = new Alien(gameEngine, player);

	gameEngine.addEntity(map);  

	for(var i = 0; i < numTrees; i++) {
		var foliage = new Foliage(gameEngine);
		gameEngine.addEnvironmentEntity(foliage); 
		if(i == 1 || i == 4) {
			gameEngine.addNpcEntity(new RobotTier1(gameEngine, foliage), true);     
		}    
	}

	for(var i = 0; i < numBuildings; i++) {
		var building = new Building(gameEngine);
		gameEngine.addEnvironmentEntity(building); 
		if(i == 1) {
			gameEngine.addNpcEntity(new RobotTier1(gameEngine, building), true);     
		}  
	}

	gameEngine.addNpcEntity(spaceship, true);   
	gameEngine.addNpcEntity(scav, false);   
	gameEngine.addNpcEntity(robot, true);       
	gameEngine.addNpcEntity(alien, false);       
	gameEngine.addNpcEntity(rummager, false);      
	gameEngine.addNpcEntity(player, true);  
 
	console.log("All Done!");
});
