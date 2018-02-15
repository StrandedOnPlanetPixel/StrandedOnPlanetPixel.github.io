
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
	this.stillAnimation = new Animation(spritesheet,        0,	256,    64, 64, 0.1,	1, true,	false,	0.75);
	this.upAnimation = new Animation(spritesheet,           0,	448,	64, 64, 0.1, 	8, true,	false,	0.75);
	this.downAnimation = new Animation(spritesheet,         0,	256,    64, 64, 0.1, 	8, true,	false,	0.75);
	this.rightAnimation = new Animation(spritesheet,        0,	384,    64, 64, 0.1, 	8, true,	false,	0.75);
	this.leftAnimation = new Animation(spritesheet,         0,	320,    64, 64, 0.1, 	8, true,	false,	0.75);    
	this.attackAnimation = new Animation(spritesheet,       0,	0,		64, 64, 0.1, 	8, true,	false,	0.75);    
	this.frontAttackAnimation = new Animation(spritesheet,  0,	0,		64, 64, 0.1, 	8, true,	false,	0.75);    
 	this.leftAttackAnimation = new Animation(spritesheet,   0,	0,		64, 64, 0.1, 	8, true,	false,	0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,	64,		64, 64, 0.1, 	8, true,	false,	0.75);
	this.programAnimation = new Animation(spritesheet,      0,	192,	64, 64, 0.1, 	8, true,	false,	0.75);
	this.dyingAnimation = new Animation(spritesheet,        0,	128,	64, 64, 0.1,	8, false,	false,	0.75); 
	this.deadAnimation = new Animation(spritesheet,        448,	128,	64, 64, 0.1,	1, true,	false,	0.75);  

	this.game = game;
	this.ctx = game.ctx; 
	Entity.call(this, game, width / 2, height / 2 ); 
	this.radius = 24;   
	this.x += this.radius;
	this.y += this.radius;
 	this.lives = 10;
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

	if(collide(this, closestEnt)) {
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

	if(collide(this, closestEnt)) {
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
	this.leftAnimation = new Animation(spritesheet,		0,    0,     64, 64, 0.1, 8, true,  false,  0.75);
	this.rightAnimation = new Animation(spritesheet,	0,    64,    64, 64, 0.1, 8, true,  false,  0.75);
	this.upAnimation = new Animation(spritesheet,		0,    128,   64, 64, 0.1, 8, true,  false, 	0.75);
	this.downAnimation = new Animation(spritesheet,		0,    192,   64, 64, 0.1, 8, true,  false,	0.75);    
	
	this.game = game;
	this.ctx = game.ctx;  
	Entity.call(this, game, Math.random() * width, height);
	this.radius = 24;
	this.lives = 200;
	this.speed = 50;
	this.visualRadius = 200;
	this.lastBulletTime = 0;
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
 		if(!this.lastBulletTime || (this.lastBulletTime < this.game.timer.gameTime - 1.5)) {
 			//record last shot time and create the bullet.
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
 	    	ent.lives -= 5;
     	    this.removeFromWorld = true;
        }  
    } 

    if(!this.removeFromWorld) { 
		moveEntityToTarget(this, this.targetLocation);
    } 

	Entity.prototype.update.call(this);  			
}

Bullet.prototype.draw = function() {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);  
	Entity.prototype.draw.call(this);
}

function RobotTier1(game, target) { //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, scale
	var spriteSheet = AM.getAsset("img/robotSpriteSheet1.png"); 
	this.upAnimation = new Animation(spriteSheet, 0, 512, 64, 64, 0.1, 8, true, false, 0.75);
	this.downAnimation = new Animation(spriteSheet, 0, 0, 64, 64, 0.1, 8, true, false, 0.75);
	this.rightAnimation = new Animation(spriteSheet, 0, 1152, 64, 64, 0.1, 11, true, false, 0.75);
	this.leftAnimation = new Animation(spriteSheet, 0, 1088, 64, 64, 0.1, 11, true, false, 0.75);
		
	this.repairUpAnimation = new Animation(spriteSheet, 512, 640, 64, 64, 0.1, 4, true, false, 0.75);
	this.repairDownAnimation = new Animation(spriteSheet, 256, 512, 64, 64, 0.1, 4, true, false, 0.75);
	this.repairRightAnimation = new Animation(spriteSheet, 0, 192, 64, 64, 0.1, 4, true, false, 0.75);
	this.repairLeftAnimation = new Animation(spriteSheet, 512, 704, 64, 64, 0.1, 4, true, false, 0.75);
		
	this.gatherBerryUpAnimation = new Animation(spriteSheet, 256, 640, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherBerryDownAnimation = new Animation(spriteSheet, 0, 704, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherBerryRightAnimation = new Animation(spriteSheet, 512, 320, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherBerryLeftAnimation = new Animation(spriteSheet, 512, 384, 64, 64, 0.1, 4, true, false, 0.75);

	this.gatherScrapUpAnimation = new Animation(spriteSheet, 512, 448, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherScrapDownAnimation = new Animation(spriteSheet, 0, 512, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherScrapRightAnimation = new Animation(spriteSheet, 512, 192, 64, 64, 0.1, 4, true, false, 0.75);
	this.gatherScrapLeftAnimation = new Animation(spriteSheet, 512, 512, 64, 64, 0.1, 4, true, false, 0.75);
	
	this.animation = this.downAnimation;

	//add rest
	this.speed = 75;  
	this.game = game;
	this.ctx = game.ctx; 
	this.radius = 24;
	Entity.call(this, game, width / 2, height / 2);
	this.taskEntity = target;	
	this.directions = ["left", "right", "up", "down"];
 	this.tasks = ["repair", "gatherBerry", "gatherScrap"]; /* ,"charge" ??? Do we need?*/ 
	this.task = this.tasks[0];
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
			if(this.dir === this.directions[3]){
				this.animation = this.gatherScrapDownAnimation;
			} else if(this.dir === this.directions[0]){
				this.animation = this.gatherScrapLeftAnimation;		
			} else if(this.dir === this.directions[1]){
				this.animation = this.gatherScrapRightAnimation;		
			} else{
				this.animation = this.gatherScrapUpAnimation;
			}
		}
 	} else {  // move to the entity
		moveEntityToTarget(this, this.taskEntity); 
	} 
	Entity.prototype.update.call(this);  
}

RobotTier1.prototype.draw = function(){
 	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);  
	Entity.prototype.draw.call(this);
}


// Environment Entities
function Tree(game, x, y) {
	this.image = new Animation(AM.getAsset("img/tree.png"), 0, 0, 128, 128, 0.1, 1, true, false, 0.95);
	this.game = game;   
	this.ctx = game.ctx;     
	Entity.call(this, game, x, y);  
	this.radius = 62; 
}

Tree.prototype = new Entity();
Tree.prototype.constructor = Tree;

Tree.prototype.update = function () {
}

Tree.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
}
 
function BerryBush(game, x, y) {
	this.image = new Animation(AM.getAsset("img/bush.png"), 0, 0, 64, 64, 0.1, 1, true, false, 0.95);
	this.game = game;   
	this.ctx = game.ctx;     
	Entity.call(this, game, x, y);  
	this.radius = 30; 
}

BerryBush.prototype = new Entity();
BerryBush.prototype.constructor = BerryBush;

BerryBush.prototype.update = function () {
}

BerryBush.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
}

// Environment Entities
function Building(game, x, y) {
	this.game = game;   
	this.ctx = game.ctx;    
 	this.spritesheet = "img/building" + (Math.floor(Math.random() * 3) + 1) + ".png";
 	this.height = 140;
 	this.radius = 68; 
 	this.image = new Animation(AM.getAsset(this.spritesheet), 0, 0, 128, this.height, 0.1, 1, true, false, 1);
	Entity.call(this, game, x, y);
     
}

Building.prototype = new Entity();
Building.prototype.constructor = Building;

Building.prototype.update = function () {
}

Building.prototype.draw = function (ctx) {	
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
}

function SpaceShip(game) {
	this.game = game;   
	this.ctx = game.ctx; 
	this.spritesheet = "img/spaceship.png";
	this.size = 160;

 	this.image = new Animation(AM.getAsset(this.spritesheet), (this.game.level * this.size), 0, 160, 160, 0.1, 1, true, false, 1);  
 	this.radius = 77;
	Entity.call(this, game, width / 2, height / 2);
 }

SpaceShip.prototype = new Entity();
SpaceShip.prototype.constructor = SpaceShip;

SpaceShip.prototype.update = function () {
}

SpaceShip.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
}

var height = null;
var width = null;
var backgroundSong = document.createElement("audio");

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

	treeEnts = [new Tree(gameEngine, 64, 64), new Tree(gameEngine, 222, 55), new Tree(gameEngine, 130, 85), 
				new Tree(gameEngine, 305, 70), new Tree(gameEngine, 85, 160), new Tree(gameEngine, 155, 193), 
				new Tree(gameEngine, 305, 220)];

	for(var i = 0; i < treeEnts.length; i++) {
		gameEngine.addTreeEntity(treeEnts[i]);
	}


	berryEnts = [new BerryBush(gameEngine, 325, 135), new BerryBush(gameEngine, 238, 150), new BerryBush(gameEngine, 215, 253),
	 			 new BerryBush(gameEngine, 44, 233), new BerryBush(gameEngine, 115, 340), new BerryBush(gameEngine, 315, 342),
 				 new BerryBush(gameEngine, 178, 365), new BerryBush(gameEngine, 245, 435), new BerryBush(gameEngine, 25, 535),
				 new BerryBush(gameEngine, 95, 500), new BerryBush(gameEngine, 165, 615), new BerryBush(gameEngine, 279, 504)];
	for(var i = 0; i < berryEnts.length; i++) {
		gameEngine.addBushEntity(berryEnts[i]);
	}

	treeEnts = [ new Tree(gameEngine, 56, 300), new Tree(gameEngine, 168, 275), new Tree(gameEngine, 269, 325), 
				 new Tree(gameEngine, 65, 395), new Tree(gameEngine, 156, 425), new Tree(gameEngine, 265, 418), 
				 new Tree(gameEngine, 99, 565), new Tree(gameEngine, 198, 530), new Tree(gameEngine, 275, 590)];

	for(var i = 0; i < treeEnts.length; i++) {
		gameEngine.addTreeEntity(treeEnts[i]);
	}


	buildingEnts = [ new Building(gameEngine, 1082, -10), new Building(gameEngine, 1222, 60), new Building(gameEngine, 1130, 102),
					 new Building(gameEngine, 1225, 195), new Building(gameEngine, 1105, 235), new Building(gameEngine, 1200, 295),
					 new Building(gameEngine, 1140, 351), new Building(gameEngine, 1255, 400), new Building(gameEngine, 1165, 450),
					 new Building(gameEngine, 1195, 493), new Building(gameEngine, 1235, 563)];

	for(var i = 0; i < buildingEnts.length; i++) {
		gameEngine.addBuildingEntity(buildingEnts[i]);
	}


	gameEngine.addNpcEntity(spaceship, true);   
	gameEngine.addNpcEntity(scav, false);   
	gameEngine.addNpcEntity(robot, true);       
	gameEngine.addNpcEntity(alien, false);       
	gameEngine.addNpcEntity(rummager, false);      
	gameEngine.addNpcEntity(player, true);  

	setupSound();
	console.log("All Done!");
});

function setupSound() {
	backgroundSong.src = "audio/Module2.mp3";
	backgroundSong.loop = "true";
	backgroundSong.play()
	//var audioToggle = document.getElementById("audioToggle").addEventListener("click", toggleSound); 
}

function toggleSound() {
	if(backgroundSong.paused) {
		console.log("playing sound");
		backgroundSong.play();			
	} else {
		console.log("paused sound");
		backgroundSong.pause();
	}
}
