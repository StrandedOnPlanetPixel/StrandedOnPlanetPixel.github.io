
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
};

Animation.prototype.drawTime = function (tick, ctx, x, y) {
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

	var frame = index * this.frameWidth + offset; 
	var offset = vindex === 0 ? this.startX : 0;
	ctx.drawImage(this.spriteSheet,
				  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
				  this.frameWidth, this.frameHeight,
				  x, y,
				  this.frameWidth * scaleBy,
				  this.frameHeight * scaleBy);
};
 	 

Animation.prototype.currentFrame = function () {
	return Math.floor(this.elapsedTime / this.frameDuration);
};

Animation.prototype.isDone = function () {
	return (this.elapsedTime >= this.totalTime);
};

function distance(a, b) {
 	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
};
 
function collide(ent, otherEnt) { 
	if(ent && otherEnt) {
		return distance(ent, otherEnt) < ent.radius + otherEnt.radius;
	}    
	return false;
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
	if(Math.abs(dx) > Math.abs(dy)) { 
		if(dx < 0) {
			ent.dir = "left";
			ent.animation = ent.leftAnimation;
		} else {
			ent.dir = "right";
			ent.animation = ent.rightAnimation;
		} 
	} else {     
		if(dx < 0 || dy > 0) {          
			ent.dir = "down";
			ent.animation = ent.downAnimation;
		} else {                
			ent.dir = "up"; 
			ent.animation = ent.upAnimation;
		}
	} 
	ent.x += dx * ent.game.clockTick * ent.speed;
	ent.y += dy * ent.game.clockTick * ent.speed;
};

function attack(ent, target) {
	var dx = target.x - ent.x;
	var dy = target.y - ent.y; 
	var distance = Math.sqrt(dx * dx + dy * dy);
	 
	if(distance) {  
		dx /= distance;
		dy /= distance;
	} 

	if(Math.abs(dx) > Math.abs(dy)) { 
		if(dx < 0) {
			ent.animation = ent.leftAttackAnimation;
		} else {
			ent.animation = ent.rightAttackAnimation;
		} 
	} else {     
		if(dx < 0 || dy > 0) {          
			ent.animation = ent.downAttackAnimation;
		} else {                
			ent.animation = ent.upAttackAnimation;
		}
	}  
	target.lives -= ent.damage;
};
 
function collide(ent, otherEnt) { 
	if(ent && otherEnt) {
		return distance(ent, otherEnt) < ent.radius + otherEnt.radius;
	}    
	return false;
}

function collideLeft(ent) {
	return (ent.x - ent.radius) < 0;
}

function collideRight(ent) {
	return (ent.x + ent.radius) > width;
}

function collideTop(ent) {
	return (ent.y - ent.radius) < 0;
}

function collideBottom(ent) {
	return (ent.y + ent.radius) > height;
}

function moveEntityToTarget(ent, target) { 
	var dx = target.x - ent.x;
	var dy = target.y - ent.y; 
	var distance = Math.sqrt(dx * dx + dy * dy);
	 
	if(distance) {  
		dx /= distance;
		dy /= distance;
	}   
	if(Math.abs(dx) > Math.abs(dy)) { 
		if(dx < 0) {
			ent.dir = "left";
			ent.animation = ent.leftAnimation;
		} else {
			ent.dir = "right";
			ent.animation = ent.rightAnimation;
		} 
	} else {     
		if(dx < 0 || dy > 0) {          
			ent.dir = "down";
			ent.animation = ent.downAnimation;
		} else {                
			ent.dir = "up"; 
			ent.animation = ent.upAnimation;
		}
	} 
	ent.x += dx * ent.game.clockTick * ent.speed;
	ent.y += dy * ent.game.clockTick * ent.speed;
}

 
// no inheritance
function Background(game) {
	Entity.call(this, game, 0, 0); 
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
};

Background.prototype.draw = function (ctx) {
	ctx.drawImage(AM.getAsset("img/map.png"), 0, 0);
	Entity.prototype.draw.call(this);
};

function Player(game) {
 	var spritesheet = AM.getAsset("img/space_traveler.png");
	this.animation = new Animation(spritesheet,             0,  448,    64, 64, 0.1,    8, true,    false,  0.75);
	this.stillAnimation = new Animation(spritesheet,        0,  256,    64, 64, 0.1,    1, true,    false,  0.75);
	this.upAnimation = new Animation(spritesheet,           0,  448,    64, 64, 0.095,  8, true,    false,  0.75);
	this.downAnimation = new Animation(spritesheet,         0,  256,    64, 64, 0.095,  8, true,    false,  0.75);
	this.rightAnimation = new Animation(spritesheet,        0,  384,    64, 64, 0.095,  8, true,    false,  0.75);
	this.leftAnimation = new Animation(spritesheet,         0,  320,    64, 64, 0.095,  8, true,    false,  0.75);    
	this.attackAnimation = new Animation(spritesheet,       0,  0,      64, 64, 0.1,    8, true,    false,  0.75);    
	this.frontAttackAnimation = new Animation(spritesheet,  0,  0,      64, 64, 0.1,    8, true,    false,  0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   0,  0,      64, 64, 0.1,    8, true,    false,  0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,  64,     64, 64, 0.1,    8, true,    false,  0.75);
	this.programAnimation = new Animation(spritesheet,      0,  192,    64, 64, 0.1,    8, true,    false,  0.75);
	this.dyingAnimation = new Animation(spritesheet,        0,  128,    64, 64, 0.1,    8, false,   false,  0.75); 
	this.deadAnimation = new Animation(spritesheet,        448, 128,    64, 64, 0.1,    1, true,    false,  0.75);  

	this.game = game;
	this.ctx = game.ctx;  
	Entity.call(this, game, (width / 2) - 25, (height / 2 ) + 25);  
	this.radius = 24;   
	this.x += this.radius;
	this.y += this.radius;
	this.lives = 200;
	this.speed = 150; 
	this.damage = 10;
	this.lastAttackTime = 0;
};

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
		if(this.game.keys.up) {
			this.attackAnimation = this.frontAttackAnimation;
			this.animation = this.upAnimation;
			this.y -= this.game.clockTick * this.speed;  
		} else if (this.game.keys.down) {  
			this.attackAnimation = this.frontAttackAnimation;
			this.animation = this.downAnimation;
			this.y += this.game.clockTick * this.speed;
		} else if (this.game.keys.left) {
			this.attackAnimation = this.leftAttackAnimation;
			this.animation = this.leftAnimation; 
			this.x -= this.game.clockTick * this.speed;   
		} else if (this.game.keys.right) {
			this.attackAnimation = this.rightAttackAnimation;
			this.animation = this.rightAnimation;    
			this.x += this.game.clockTick * this.speed;      
		} else {
			this.attackAnimation = this.frontAttackAnimation;
			this.animation = this.stillAnimation;    
		} 
		if(this.game.keys.program) {
			this.animation = this.programAnimation;
		}  
		if(this.game.keys.attack) {
			this.animation = this.attackAnimation;
			for (var i = 0; i < this.game.hostileEntities.length; i++) {
				var ent = this.game.hostileEntities[i];
				if (this != ent && collide(this, ent) && this.game.keys.attack &&
					(!this.lastAttackTime || (this.lastAttackTime < this.game.timer.gameTime - 0.5))) {
						//record last shot time and create the bullet.
						console.log(ent);
 						console.log(ent.lives);
 						ent.lives -= this.damage;
 						console.log(ent.lives);
 						this.lastAttackTime = this.game.timer.gameTime; 
 				}  
			} 
		}   
	} else {
		this.animation = this.deadAnimation;
	} 
	Entity.prototype.update.call(this); 
};

Player.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius); 
	Entity.prototype.draw.call(this); 
};
 
function Alien(game, enemy) {  
	var spritesheet = AM.getAsset("img/alien.png");
	this.animation = new Animation(spritesheet,             256,    192,     64, 64, 0.1, 4, true,  false,  0.75);
	this.upAnimation = new Animation(spritesheet,           256,    192,     64, 64, 0.1, 4, true,  false,  0.75);
	this.downAnimation = new Animation(spritesheet,         0,     64,    64, 64, 0.1, 4, true,  false,  0.75);
	this.rightAnimation = new Animation(spritesheet,        0,   256,    64, 64, 0.1, 4, true,   false, 0.75);
	this.leftAnimation = new Animation(spritesheet,         256,   256,    64, 64, 0.1, 4, true, false,   0.75);    
	this.upAttackAnimation = new Animation(spritesheet,     0,    128,  64, 64, 0.1, 4, true, false,   0.75);    
	this.downAttackAnimation = new Animation(spritesheet,   0,      128,  64, 64, 0.1, 4, true, false,   0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  256,   64, 64, 64, 0.1, 4, true, false,   0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   0,    192,  64, 64, 0.1, 4, true, false,   0.75); 
	this.dyingAnimation = new Animation(spritesheet,        0,    0, 64, 64, 0.1, 8, false,  false,  0.75);    
	
	this.game = game;
	this.ctx = game.ctx; 
	this.enemy = enemy;
	Entity.call(this, game, Math.random() * width, height);
	this.radius = 24;
	this.lives = 150;
	this.speed = 50;
	this.damage = 2;
	this.visualRadius = 200;
	this.lastAttackTime = 0;
	this.task = 3;
};

Alien.prototype = new Entity();
Alien.prototype.constructor = Alien;

Alien.prototype.update = function () { 
 	if(this.dead) {
		this.removeFromWorld = true;
	} if(this.lives < 0) {
		//dead
		this.animation = this.dyingAnimation;
		this.dead = true;
	} else {
		if (collideLeft(this) || collideRight(this)) { 
			if (collideLeft(this)) this.x = this.radius;
			if (collideRight(this)) this.x = width - this.radius; 
		}

		if (collideTop(this) || collideBottom(this)) {
			if (collideTop(this)) this.y = this.radius;
			if (collideBottom(this)) this.y = height - this.radius; 
		}
 
		var closestEnt = this.game.friendlyEntities[0];
		for (i = 0; i < this.game.friendlyEntities.length; i++) {
			ent = this.game.friendlyEntities[i];
			if (ent != this && collide(this, { x: ent.x, y: ent.y, radius: this.visualRadius })) {
				var dist = distance(this, ent); 
				if(dist < distance(this, closestEnt)) {
					closestEnt = ent;
				}
			}  
		}

 		if(collide(this, closestEnt)) {
			if(!this.lastAttackTime || (this.lastAttackTime < this.game.timer.gameTime - 1.5)) {
				//record last shot time and create the bullet.
				attack(this, closestEnt);
 				this.lastAttackTime = this.game.timer.gameTime; 
			}  
		} else {
			moveEntityToTarget(this, closestEnt);
		} 
	}
	Entity.prototype.update.call(this);  
};

Alien.prototype.draw = function () { 
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius); 
	Entity.prototype.draw.call(this); 
};
 
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
	this.lives = 150;
	this.damage = 3;
	this.speed = 50;
	this.visualRadius = 200;
	this.dead = false;
	this.lastAttackTime = 0;
	this.task = 3;
	Entity.call(this, game, Math.floor((Math.random() * this.game.width ) + 1), this.game.height);
}

Scavenger.prototype = new Entity();
Scavenger.prototype.constructor = Scavenger;

Scavenger.prototype.update = function () {
	if(this.dead) {
		this.removeFromWorld = true;
	} if(this.lives < 0) {
		//dead
		this.animation = this.dyingAnimation;
		this.dead = true;
	} else {
		if (collideLeft(this) || collideRight(this)) { 
			if (collideLeft(this)) this.x = this.radius;
			if (collideRight(this)) this.x = width - this.radius; 
		}

		if (collideTop(this) || collideBottom(this)) {
			if (collideTop(this)) this.y = this.radius;
			if (collideBottom(this)) this.y = height - this.radius; 
		}

		var closestEnt = this.game.friendlyEntities[0];
		for (i = 0; i < this.game.friendlyEntities.length; i++) {
			ent = this.game.friendlyEntities[i];
			if (ent != this && collide(this, { x: ent.x, y: ent.y, radius: this.visualRadius })) {
				var dist = distance(this, ent); 
				if(dist < distance(this, closestEnt)) {
					closestEnt = ent;
				}
			}  
		}

		if(collide(this, closestEnt)) {
			if(!this.lastAttackTime || (this.lastAttackTime < this.game.timer.gameTime - 1.5)) {
				//record last shot time and create the bullet.
				attack(this, closestEnt);
  				this.lastAttackTime = this.game.timer.gameTime; 
			} 
		} else {
			moveEntityToTarget(this, closestEnt);
		} 
	}
	Entity.prototype.update.call(this);  
};

Scavenger.prototype.draw = function () { 
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius); 
	Entity.prototype.draw.call(this); 
};

function Rummager(game, enemy) {  
	var spritesheet = AM.getAsset("img/rummager.png"); 
	this.leftAnimation = new Animation(spritesheet,     0,    0,     64, 64, 0.1, 8, true,  false,  0.75);
	this.rightAnimation = new Animation(spritesheet,    0,    64,    64, 64, 0.1, 8, true,  false,  0.75);
	this.upAnimation = new Animation(spritesheet,       0,    128,   64, 64, 0.1, 8, true,  false,  0.75);
	this.downAnimation = new Animation(spritesheet,     0,    192,   64, 64, 0.1, 8, true,  false,  0.75);    
	
	this.leftAttackAnimation = new Animation(spritesheet,       0,    0,     64, 64, 0.1, 8, true,  false,  0.75);
	this.rightAttackAnimation = new Animation(spritesheet,  0,    64,    64, 64, 0.1, 8, true,  false,  0.75);
	this.upAttackAnimation = new Animation(spritesheet,     0,    128,   64, 64, 0.1, 8, true,  false,  0.75);
	this.downAttackAnimation = new Animation(spritesheet,       0,    192,   64, 64, 0.1, 8, true,  false,  0.75);    
	this.animation = this.upAnimation;

	this.game = game;
	this.ctx = game.ctx;  
	Entity.call(this, game, Math.random() * width, height);
	this.radius = 24;
	this.lives = 100;
	this.damage = 0; // has zero close attack (real damage comes from bullets)
	this.speed = 50;
	this.visualRadius = 200;
	this.lastBulletTime = 0;
	this.task = 3;
};

Rummager.prototype = new Entity();
Rummager.prototype.constructor = Rummager;

Rummager.prototype.update = function () {
	if(this.lives < 0) {
		//dead
		this.removeFromWorld = true;
	} else {
		if (collideLeft(this) || collideRight(this)) { 
			if (collideLeft(this)) this.x = this.radius;
			if (collideRight(this)) this.x = width - this.radius; 
		}

		if (collideTop(this) || collideBottom(this)) {
			if (collideTop(this)) this.y = this.radius;
			if (collideBottom(this)) this.y = height - this.radius; 
		}

		var closestEnt = this.game.friendlyEntities[0];
		for (var i = 0; i < this.game.friendlyEntities.length; i++) {
			var ent = this.game.friendlyEntities[i];
			if (ent != this && collide(this, { x: ent.x, y: ent.y, radius: this.visualRadius})) {
				var dist = distance(this, ent); 
				if(dist < distance(this, closestEnt)) {
					closestEnt = ent;
				}
			}  
		}

		if(collide(this, {x: closestEnt.x, y: closestEnt.y, radius: this.visualRadius})) {
			//this.animation = this.shootAnimation;
			if(!this.lastBulletTime || (this.lastBulletTime < this.game.timer.gameTime - 1.5)) {
				//record last shot time and create the bullet.
				attack(this, closestEnt);
				this.game.addEntity(new Bullet(this.game, this, closestEnt));
				this.lastBulletTime = this.game.timer.gameTime; 
			}
		} else {
			moveEntityToTarget(this, closestEnt);
		} 
	}
	Entity.prototype.update.call(this);  
}; 

Rummager.prototype.draw = function () { 
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);  
	Entity.prototype.draw.call(this); 
};

function Bullet(game, parent, target) {
	var spriteSheet = AM.getAsset("img/bullet.png");
	this.animation = new Animation(spriteSheet, 0, 0, 16, 16, 0.1, 1, true, false, 0.75);
	// The bullet needs directional animations for helper method
	this.upAnimation = this.downAnimation = this.leftAnimation = this.rightAnimation = this.animation;

	var dy = target.y - parent.y;
	var dx = target.x - parent.x;
	this.targetLocation = {x: dx * 100, y: dy * 100, radius: target.radius}; 
	this.target = target;  
	this.game = game;
	this.ctx = game.ctx; 
	Entity.call(this, game, parent.x, parent.y);
	this.radius = 6; 
	this.damage = 5;
	this.speed = 75; 
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

	for (var i = 0; i < this.game.friendlyEntities.length; i++) {
		var ent = this.game.friendlyEntities[i];
		if (this != ent && collide(this, ent)) {
			ent.lives -= this.damage;
			this.removeFromWorld = true;
		}  
	} 

	if(!this.removeFromWorld) { 
		moveEntityToTarget(this, this.targetLocation);
	} 

	Entity.prototype.update.call(this);                     
}; 

Bullet.prototype.draw = function() {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);  
	Entity.prototype.draw.call(this);
};

function RobotTier1(game, target) { //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, scale
	var spriteSheet = AM.getAsset("img/robotSpriteSheet1.png"); 
	
	//walking animations
	this.upAnimation = new Animation(spriteSheet, 0, 320, 64, 64, 0.1, 8, true, false, 0.75);
	this.downAnimation = new Animation(spriteSheet, 0, 0, 64, 64, 0.1, 8, true, false, 0.75);
	this.rightAnimation = new Animation(spriteSheet, 0, 1152, 64, 64, 0.1, 11, true, false, 0.75);
	this.leftAnimation = new Animation(spriteSheet, 0, 1088, 64, 64, 0.1, 11, true, false, 0.75);
		
	//repairing animations
	this.repairUpAnimation = new Animation(spriteSheet, 512, 640, 64, 64, 0.1, 4, true, false, 0.75);
	this.repairDownAnimation = new Animation(spriteSheet, 256, 512, 64, 64, 0.1, 4, true, false, 0.75);
	this.repairRightAnimation = new Animation(spriteSheet, 0, 192, 64, 64, 0.1, 4, true, false, 0.75);
	this.repairLeftAnimation = new Animation(spriteSheet, 512, 704, 64, 64, 0.1, 4, true, false, 0.75);
		
	//gathering berries animation
	this.gatherBerryUpAnimation = new Animation(spriteSheet, 256, 640, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherBerryDownAnimation = new Animation(spriteSheet, 0, 704, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherBerryRightAnimation = new Animation(spriteSheet, 512, 320, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherBerryLeftAnimation = new Animation(spriteSheet, 512, 384, 64, 64, 0.1, 4, true, false, 0.75);

	//gathering scrap animation
	this.gatherScrapUpAnimation = new Animation(spriteSheet, 512, 448, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherScrapDownAnimation = new Animation(spriteSheet, 0, 512, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherScrapRightAnimation = new Animation(spriteSheet, 512, 192, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherScrapLeftAnimation = new Animation(spriteSheet, 512, 512, 64, 64, 0.1, 4, true, false, 0.75);
	
	//logging animation
	this.loggingUpAnimation = new Animation(spriteSheet, 256, 704, 64, 64, 0.1, 4, true, false, 0.75);
	this.loggingDownAnimation = new Animation(spriteSheet, 256, 64, 64, 64, 0.1, 4, true, false, 0.75);
	this.loggingRightAnimation = new Animation(spriteSheet, 448, 960, 64, 64, 0.1, 4, true, false, 0.75);
	this.loggingLeftAnimation = new Animation(spriteSheet, 512, 256, 64, 64, 0.1, 4, true, false, 0.75);
	
	//defending animation
	this.defendingUpAnimation = new Animation(spriteSheet, 384, 832, 64, 64, 0.1, 6, true, false, 0.75);
	this.defendingDownAnimation = new Animation(spriteSheet, 0, 128, 64, 64, 0.1, 6, true, false, 0.75);
	this.defendingRightAnimation = new Animation(spriteSheet, 0, 256, 64, 64, 0.1, 6, true, false, 0.75);
	this.defendingLeftAnimation = new Animation(spriteSheet, 0, 384, 64, 64, 0.1, 6, true, false, 0.75);
	
	//charging animation
	this.chargeUpAnimation = new Animation(spriteSheet, 0, 448, 64, 64, 0.1 , 6, true, false, 0.75);
	this.chargeDownAnimation = new Animation(spriteSheet, 0, 576, 64, 64, 0.1, 6, true, false, 0.75);
	this.chargeRightAnimation =  new Animation(spriteSheet, 0, 768, 64, 64, 0.1, 6, true, false, 0.75);
	this.chargeLeftAnimation = new Animation(spriteSheet, 0, 832, 64, 64, 0.1, 6, true, false, 0.75);
	
	//powering down animation
	this.pDUpAnimation = new Animation(spriteSheet, 0, 896, 64, 64, 0.1, 6, true, false, 0.75);
	this.pDDownAnimation = new Animation(spriteSheet, 384, 768, 64, 64, 0.1, 6, true, false, 0.75);
	this.pDRightAnimation = new Animation(spriteSheet, 0, 960, 64, 64, 0.1, 6, true, false, 0.75);
	this,pDLeftAnimation = new Animation(spriteSheet, 384, 896, 64, 64, 0.1, 6, true, false, 0.75);
	
	//Dying animation
	this.dyingUpAnimation = new Animation(spriteSheet, 512, 576, 64, 64, 0.1, 4, true, false, 0.75);
	this.dyingDownAnimation = new Animation(spriteSheet, 0, 640, 64, 64, 0.1, 4, true, false, 0.75);
	this.dyingRightAnimation = new Animation(spriteSheet, 512, 0, 64, 64, 0.1, 4, true, false, 0.75);
	this.dyingLeftAnimation = new Animation(spriteSheet, 512, 128, 64, 64, 0.1, 4, true, false, 0.75);
	
	//mining animation
	this.mineUpAnimation = new Animation(spriteSheet, 0, 64, 64, 64, 0.1, 4, true, false, 0.75);
	this.mineDownAnimation = new Animation(spriteSheet, 256, 192, 64, 64, 0.1, 4, true, false, 0.75);
	this.mineRightAnimation = new Animation(spriteSheet, 384, 960, 64, 64, 0.1, 4, true, false, 0.75);
	this.mineLeftAnimation = new Animation(spriteSheet, 512, 64, 64, 64, 0.1, 4, true, false, 0.75);
	
	this.animation = this.downAnimation;

	//add rest
	this.speed = 75;  
	this.game = game;
	this.ctx = game.ctx; 
	this.radius = 24;
	Entity.call(this, game, width / 2, height / 2);
	this.taskEntity = target;	
	this.directions = ["left", "right", "up", "down"];
 	this.tasks = ["repair", "gatherBerry", "gatherScrap", "defend", "mine", "log", "charge", "dying"]; /* ,"charge" ??? Do we need?*/ 
	this.task = this.tasks[target.task];
	this.dead = false; 
	this.life = 200; //robots life?
}

RobotTier1.prototype = new Entity();
RobotTier1.prototype.constructor = RobotTier1;

RobotTier1.prototype.update = function() {
	if (collideLeft(this)) {
		this.x += this.radius;
		
	}	
	if (collideRight(this)) {  
		this.x -= this.radius;
    }

    if (collideTop(this)) { 
		this.y += this.radius;
    }

    if(collideBottom(this)) { 
		this.y -= this.radius;
    }
	
    // If the robot reaches its target entity 
	if(collide(this, this.taskEntity)){ 
		// fix repair directions;
		if (this.task === this.tasks[0] ) { // repair
			if(this.dir === this.directions[3]){
				this.animation = this.repairDownAnimation;
			} else if(this.dir === this.directions[0]){
				this.animation = this.repairLeftAnimation;		
			} else if(this.dir === this.directions[1]){
				this.animation = this.repairRightAnimation;		
			} else {
				this.animation = this.repairUpAnimation;		
			}				
		} else if (this.task === this.tasks[1]) { //gather berry
			if(this.dir === this.directions[3]){
				this.animation = this.gatherBerryDownAnimation;
			} else if(this.dir === this.directions[0]){
				this.animation = this.gatherBerryLeftAnimation;		
			} else if(this.dir === this.directions[1]){
				this.animation = this.gatherBerryRightAnimation;		
			} else{
				this.animation = this.gatherBerryUpAnimation;		
			}
		} else if (this.task === this.tasks[2]) { //gather scrap
			state.scrap += 1;
			if(this.dir === this.directions[3]){
				this.animation = this.gatherScrapDownAnimation;
			} else if(this.dir === this.directions[0]){
				this.animation = this.gatherScrapLeftAnimation;		
			} else if(this.dir === this.directions[1]){
				this.animation = this.gatherScrapRightAnimation;		
			} else{
				this.animation = this.gatherScrapUpAnimation;
			}
		} else if (this.task === this.tasks[5]) { //logging
			if(this.dir === this.directions[3]){
				this.animation = this.loggingDownAnimation;
			} else if(this.dir === this.directions[0]){
				this.animation = this.loggingLeftAnimation;		
			} else if(this.dir === this.directions[1]){
				this.animation = this.loggingRightAnimation;		
			} else{
				this.animation = this.loggingUpAnimation;
			}
		} else if (this.task === this.tasks[4]) { //mining
			if(this.dir === this.directions[3]){
				this.animation = this.mineDownAnimation;
			} else if(this.dir === this.directions[0]){
				this.animation = this.mineLeftAnimation;		
			} else if(this.dir === this.directions[1]){
				this.animation = this.mineRightAnimation;		
			} else{
				this.animation = this.mineUpAnimation;
			}
		}
 	} else {  // move to the entity
		moveEntityToTarget(this, this.taskEntity); 
	} 
	Entity.prototype.update.call(this);  
};

RobotTier1.prototype.draw = function(){
 	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);  
	Entity.prototype.draw.call(this);
};

 

// Environment Entities
function Tree(game, x, y) {
	this.image = new Animation(AM.getAsset("img/tree.png"), 0, 0, 128, 128, 0.1, 1, true, false, 0.95);
	this.game = game;   
	this.ctx = game.ctx;     
	Entity.call(this, game, x, y);  
	this.radius = 62; 
	this.task = 5;
}

Tree.prototype = new Entity();
Tree.prototype.constructor = Tree;

Tree.prototype.update = function () {
};

Tree.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
};
 
function BerryBush(game, x, y) {
	this.image = new Animation(AM.getAsset("img/bush.png"), 0, 0, 64, 64, 0.1, 1, true, false, 0.95);
	this.game = game;   
	this.ctx = game.ctx;     
	Entity.call(this, game, x, y);  
	this.radius = 30; 
	this.task = 1;
}

BerryBush.prototype = new Entity();
BerryBush.prototype.constructor = BerryBush;

BerryBush.prototype.update = function () {
};

BerryBush.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
};

function Rock(game, x, y) {
	this.image = new Animation(AM.getAsset("img/rock"+ (Math.floor(Math.random() * 2) + 1) + ".png"), 0, 0, 32, 32, 0.1, 1, true, false, 1);
	this.game = game;   
	this.ctx = game.ctx;     
	Entity.call(this, game, x, y);  
	this.radius = 30; 
	this.task = 4;
};

Rock.prototype = new Entity();
Rock.prototype.constructor = Rock;

Rock.prototype.update = function () {
};

Rock.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
};

// Environment Entities
function Building(game, x, y) {
	this.game = game;   
	this.ctx = game.ctx;    
	this.spritesheet = "img/building" + (Math.floor(Math.random() * 3) + 1) + ".png";
	this.height = 140;
	this.radius = 68; 
	this.task = 2;
	this.image = new Animation(AM.getAsset(this.spritesheet), 0, 0, 128, this.height, 0.1, 1, true, false, 1);
	Entity.call(this, game, x, y); 
};

Building.prototype = new Entity();
Building.prototype.constructor = Building;

Building.prototype.update = function () {
};

Building.prototype.draw = function (ctx) {   
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
}

function SpaceShip(game) {
	this.game = game;   
	this.ctx = game.ctx; 
	this.spritesheet = "img/spaceship.png";
	this.size = 160;
	this.image = new Animation(AM.getAsset(this.spritesheet), (0 * this.size), 0, 160, 160, 0.1, 1, true, false, 1);  
	this.radius = 77;
	this.lives = 500;
	Entity.call(this, game, width / 2, height / 2);
 
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
};
 

SpaceShip.prototype = new Entity();
SpaceShip.prototype.constructor = SpaceShip;
 
SpaceShip.prototype.update = function () {  
 	this.image = new Animation(AM.getAsset(this.spritesheet), (this.game.state.level * this.size), 0, 160, 160, 0.1, 1, true, false, 1);  

	if(collide(this, this.game.click)) {
		console.log("you clicked on the space ship");
		this.game.click = null;
	}  
	if(collide(this, this.game.mouse)) {
 		document.getElementById("gameWorld").style.cursor = "pointer";      
	} else {
		document.getElementById("gameWorld").style.cursor = "";          
	}
}; 

SpaceShip.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
};

function Day(game) { 
	this.game = game;   
	this.ctx = game.ctx;  
	//function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale) {
	this.duskImage = "img/dusk.png";  
	this.eveningImage = "img/evening.png";  
	this.midnightImage = "img/evening.png";
	this.image = null;
 
	this.elapsedTime = 0;
	this.dayLength = 100; 
	this.day = true;
	this.time = "2:00";
	this.lastSpawnTime = 0;
	this.spawnRate = ((4 - 0 + 0.5) * 10);
 	Entity.call(this, game, 0, 0);
};

Day.prototype = new Entity();
Day.prototype.constructor = Day;
 
Day.prototype.update = function () {  
	this.elapsedTime += this.game.clockTick;
	if(this.elapsedTime > this.dayLength) {
		// nighttime has ended and now it is day
		this.elapsedTime = 0;
		this.image = null;
		this.day = true;
		console.log("day");
	} else if(this.elapsedTime > (this.dayLength * 0.60) ){
		this.image = this.midnightImage;
	} else if(this.elapsedTime > (this.dayLength * 0.55) ){ // || this.elapsedTime > (this.dayLength * 0.90)) {
		this.image = this.eveningImage; 
	} else if(this.elapsedTime > (this.dayLength * 0.50) ){ //|| this.elapsedTime > (this.dayLength * 0.95)) {
		this.image = this.duskImage;    
		this.day = false;
	}  

	var t = Math.floor(this.elapsedTime); 
 	var min = (t % 60);
 	var hr = Math.floor(t / 60) + 2; // clock offset
 	if(hr >= 13) {	
 		hr -= 12;
 	} 
	if(Math.floor(min / 10) === 0) {
		this.time = hr + ":0" + min;
	} else {
		this.time = hr + ":" + min;
	}

	if(!this.day) {    
		this.spawnRate = ((4 - this.game.state.level + 0.5)) * 10;
		console.log(this.spawnRate);
		if(this.elapsedTime - this.spawnRate > (this.lastSpawnTime )) { 
			this.lastSpawnTime = this.elapsedTime;
			var spawnType = Math.floor(Math.random() * Math.floor(3));
			if(spawnType === 0) {
				this.game.addNpcEntity(new Rummager(this.game), false);
			} else if(spawnType === 1) {
				this.game.addNpcEntity(new Alien(this.game), false);
			} else if(spawnType === 2) {
				this.game.addNpcEntity(new Scavenger(this.game), false);
			}  
		} 
	}  
};

Day.prototype.draw = function (ctx) { 
	if(this.image) {
		ctx.drawImage(AM.getAsset(this.image), 0, 0);
	}
	Entity.prototype.draw.call(this);
};

function State(game, player, ship, day) {
	this.player = player;
	this.ship = ship;
	this.day = day;

	this.level = 4; // change this to "upgrade" the spaceship (0 to 4)
	
	this.wood = 0;
	this.food = 0;
	this.scrap = 0;
	this.minerals = 0;

	this.robotCount = 0;

	this.shipMaxHealth = this.ship.lives;
 	this.playerMaxLives = this.player.lives;
};

State.prototype = new Entity();
State.prototype.constructor = State;
 
State.prototype.update = function () {  
	if(this.ship.lives < 0 || this.player.lives < 0) {
		gameOver();
	} else {
		if(this.day.day) {
			document.getElementById("time").innerHTML =  "<img src=\"img/time.png\"/>" + this.day.time; 
		} else {
			document.getElementById("time").innerHTML =  "<img src=\"img/time.png\"/>" + this.day.time; 
		}
		document.getElementById("woodCount").innerHTML = "<img src=\"img/tree.png\"/>" + this.wood;
		document.getElementById("foodCount").innerHTML = "<img src=\"img/bush.png\"/>" + this.food; 
		document.getElementById("metalCount").innerHTML = "<img src=\"img/metal.png\"/>" + this.scrap; 
		document.getElementById("mineralCount").innerHTML = "<img src=\"img/rock1.png\"/>" + this.minerals; 
		document.getElementById("robotCount").innerHTML = "<img src=\"img/robot.png\"/>" + this.robotCount; 
	 
	 	document.getElementById("shipHealth").style.width = "" + 100 * (this.ship.lives / this.shipMaxHealth) + "%";
		document.getElementById("shipHealth").innerHTML = this.ship.lives + "/" + this.shipMaxHealth; 

	 	document.getElementById("playerHealth").style.width = "" + 100 * (this.player.lives / this.playerMaxLives) + "%";
		document.getElementById("playerHealth").innerHTML = this.player.lives + "/" + this.playerMaxLives; 
	}
};

State.prototype.draw = function (ctx) {  
};
  
function play() {
	canvas.focus();
	gameEngine.start();
	document.getElementById("playButton").style.display = "none";
	document.getElementById("playGameText").style.display = "none";   
	document.getElementById("playGameText").style.left = "42.5%";       
	document.getElementById("gameWorld").style.opacity = "1";
};

function pause() {
	if(gameEngine.paused) {
		play();
	} else {
		gameEngine.pause();      
		document.getElementById("playButton").style.display = "";
		document.getElementById("playGameText").style.display = ""; 
		document.getElementById("playGameText").innerHTML = "Resume";      
		document.getElementById("playGameText").style.left = "44.5%"; 
		document.getElementById("gameWorld").style.opacity = "0.4";
	}
};

function gameOver() {
	if(gameEngine.gameOver) { 
 		document.location.reload();
 	} else {
		gameEngine.gameOver = true; 
		document.getElementById("playButton").style.display = "";
		document.getElementById("playGameText").style.display = ""; 
		document.getElementById("playGameText").innerHTML = "Game Over";      
		document.getElementById("playGameText").style.left = "42.3%"; 
		document.getElementById("gameWorld").style.opacity = "0.4";
	} 
};

function addEnivironmentEntities(gameEngine) {  
	var treeEnts = [new Tree(gameEngine, 64, 64), new Tree(gameEngine, 222, 55), new Tree(gameEngine, 130, 85), 
				new Tree(gameEngine, 305, 70), new Tree(gameEngine, 85, 160), new Tree(gameEngine, 155, 193), 
				new Tree(gameEngine, 305, 220)];

	for(var i = 0; i < treeEnts.length; i++) {
		gameEngine.addTreeEntity(treeEnts[i]);
	}

	var berryEnts = [new BerryBush(gameEngine, 325, 135), new BerryBush(gameEngine, 238, 150), new BerryBush(gameEngine, 215, 253),
				 new BerryBush(gameEngine, 44, 233), new BerryBush(gameEngine, 115, 340), new BerryBush(gameEngine, 315, 342),
				 new BerryBush(gameEngine, 178, 365), new BerryBush(gameEngine, 245, 435), new BerryBush(gameEngine, 25, 535),
				 new BerryBush(gameEngine, 95, 500), new BerryBush(gameEngine, 165, 615), new BerryBush(gameEngine, 279, 504)];
	for(i = 0; i < berryEnts.length; i++) {
		gameEngine.addBushEntity(berryEnts[i]);
	} 

	treeEnts = [ new Tree(gameEngine, 56, 300), new Tree(gameEngine, 168, 275), new Tree(gameEngine, 269, 325), 
				 new Tree(gameEngine, 65, 395), new Tree(gameEngine, 156, 425), new Tree(gameEngine, 265, 418), 
				 new Tree(gameEngine, 99, 565), new Tree(gameEngine, 198, 530), new Tree(gameEngine, 275, 590)];

	for(i = 0; i < treeEnts.length; i++) {
		gameEngine.addTreeEntity(treeEnts[i]);
	}

	var buildingEnts = [ new Building(gameEngine, 1082, -10), new Building(gameEngine, 1222, 60), new Building(gameEngine, 1130, 102),
					 new Building(gameEngine, 1225, 195), new Building(gameEngine, 1105, 235), new Building(gameEngine, 1200, 295),
					 new Building(gameEngine, 1140, 351), new Building(gameEngine, 1255, 400), new Building(gameEngine, 1165, 450),
					 new Building(gameEngine, 1195, 493), new Building(gameEngine, 1235, 563)];

	for(i = 0; i < buildingEnts.length; i++) {
		gameEngine.addBuildingEntity(buildingEnts[i]);
	}
   
};


var height = null;
var width = null;
var paused = true;
var gameEngine = null;
var canvas = null;

var AM = new AssetManager(); 

AM.queueDownload("img/map.png");
AM.queueDownload("img/dusk.png");
AM.queueDownload("img/evening.png");
AM.queueDownload("img/midnight.png");
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
AM.queueDownload("img/rock1.png");
AM.queueDownload("img/rock2.png");

AM.downloadAll(startGame);

function startGame() {  
	canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	document.getElementById("playButton").addEventListener("click", play);
	document.getElementById("playGameText").addEventListener("click", play);      
	ctx.canvas.addEventListener("keydown", function(e) {
		var keyPressed = String.fromCharCode(e.which); 
		if(keyPressed === 'P' || e.which === 80) pause(); 
		e.preventDefault(); 
	}, false);  


	height = canvas.height;
	width = canvas.width; 
	gameEngine = new GameEngine(); 


	var soundManager = new SoundManager();
 
	gameEngine.init(ctx); 
	gameEngine.start();
	gameEngine.pause();

	var player = new Player(gameEngine);
	var map = new Background(gameEngine); 
	var day = new Day(gameEngine);
	var spaceship = new SpaceShip(gameEngine); 
	var robot2 = new RobotTier1(gameEngine, gameEngine.buildingEntities.get(1));
	
	var state = new State(gameEngine, player, spaceship, day);

	gameEngine.state = state;
	gameEngine.addEntity(state);
	gameEngine.addEntity(map);  
	addEnivironmentEntities(gameEngine);
 

	gameEngine.addNpcEntity(spaceship, true);   
	gameEngine.addNpcEntity(player, true);  
	gameEngine.addNpcEntity(robot2, true);
	gameEngine.addEntity(day);
	
	soundManager.setupBackgroundMusic();  

	console.log("All Done!");
};
