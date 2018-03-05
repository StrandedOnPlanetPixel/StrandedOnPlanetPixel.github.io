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

	this.name = "Scavenger";
	this.game = game;
	this.ctx = game.ctx; 
	this.sound = game.sound;
	this.enemy = enemy;
	Entity.call(this, game, Math.random() * width, height);
	this.radius = 24;
	this.lives = 150;
	this.damage = 3;
	this.speed = 50;
	this.visualRadius = 200;
	this.dead = false;
	this.lastAttackTime = 0;
	this.task = 5;
	Entity.call(this, game, Math.floor((Math.random() * this.game.width ) + 1), this.game.height);

    this.deathSound = document.createElement("audio");
    this.deathSound.src = "sound_effects/scavenger_death.mp3";
    this.deathSound.loop = false;
};

Scavenger.prototype = new Entity();
Scavenger.prototype.constructor = Scavenger;

Scavenger.prototype.update = function () {
	if(this.dead) {
		this.sound.playDeathSound(this);
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