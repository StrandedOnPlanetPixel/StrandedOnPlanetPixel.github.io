function Rummager(game, enemy) {  
	var spritesheet = AM.getAsset("img/rummager.png"); 
	this.leftAnimation = new Animation(spritesheet,     0,    0,     64, 64, 0.1, 8, true,  false,  0.75);
	this.rightAnimation = new Animation(spritesheet,    0,    64,    64, 64, 0.1, 8, true,  false,  0.75);
	this.upAnimation = new Animation(spritesheet,       0,    128,   64, 64, 0.1, 8, true,  false,  0.75);
	this.downAnimation = new Animation(spritesheet,     0,    192,   64, 64, 0.1, 8, true,  false,  0.75);    
	
	this.leftAttackAnimation = new Animation(spritesheet,   64,   256,   64, 64, 0.1, 1, true,  false,  0.75);
	this.rightAttackAnimation = new Animation(spritesheet,  128,  256,   64, 64, 0.1, 1, true,  false,  0.75);
	this.upAttackAnimation = new Animation(spritesheet,     0,    128,   64, 64, 0.1, 1, true,  false,  0.75);
	this.downAttackAnimation = new Animation(spritesheet,   0,    256,   64, 64, 0.1, 1, true,  false,  0.75);    
	this.animation = this.upAnimation;

	this.name = "Rummager";
	this.game = game;
	this.sound = game.sound;
	this.ctx = game.ctx;  
	Entity.call(this, game, Math.random() * width, height);
	this.radius = 24;
	this.lives = 100;
	this.damage = 0; // has zero close attack (real damage comes from bullets)
	this.speed = 50;
	this.visualRadius = 200;
	this.lastBulletTime = 0;

	this.task = 5;

    this.attackSound = document.createElement("audio");
    this.attackSound.src = "sound_effects/rummager_attack.mp3";
    this.attackSound.loop = false;
	this.damageSound = null;

    this.game.addHealthBarEntity(new healthBar(this.game, this));
};

Rummager.prototype = new Entity();
Rummager.prototype.constructor = Rummager;

Rummager.prototype.update = function () {
	if(this.lives < 0) {
		//dead
		this.removeFromWorld = true;
		var rareDrops = Math.floor(Math.random() * 5) + 1;
		if(rareDrops == 1){
			this.game.state.scrap += 1;
		}else if(rareDrops == 2){
			this.game.state.wood += 1;
		}
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
	this.sound = this.game.sound;
	this.ctx = game.ctx; 
	Entity.call(this, game, parent.x, parent.y);
	this.radius = 6; 
	this.damage = 5;
	this.speed = 75; 
};

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
			this.sound.playDamageSound(ent);
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