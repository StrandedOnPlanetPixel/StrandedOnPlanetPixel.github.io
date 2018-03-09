function Player(game) { 
	var spritesheet = AM.getAsset("img/space_traveler1.png");
	//(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale)
	this.animation = new Animation(spritesheet,             0,  448,    64, 64, 0.1,    8, true,    false,  0.75);

	this.stillAnimation = new Animation(spritesheet,        0,  256,    64, 64, 0.1,    1, true,    false,  0.75);
	this.upAnimation = new Animation(spritesheet,           0,  448,    64, 64, 0.095,  8, true,    false,  0.75);
	this.downAnimation = new Animation(spritesheet,         0,  256,    64, 64, 0.095,  8, true,    false,  0.75);
	this.rightAnimation = new Animation(spritesheet,        0,  384,    64, 64, 0.095,  8, true,    false,  0.75);
	this.leftAnimation = new Animation(spritesheet,         0,  320,    64, 64, 0.095,  8, true,    false,  0.75);    
	this.attackAnimation = new Animation(spritesheet,       0,  0,      64, 64, 0.1,    8, false,    false,  0.75);    
	this.frontAttackAnimation = new Animation(spritesheet,  0,  0,      64, 64, 0.1,    8, true,    false,  0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   0,  512,      64, 64, 0.1,    8, true,    false,  0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,  64,     64, 64, 0.1,    8, true,    false,  0.75);
	this.programAnimation = new Animation(spritesheet,      0,  192,    64, 64, 0.1,    8, true,    false,  0.75);
	this.dyingAnimation = new Animation(spritesheet,        0,  128,    64, 64, 0.1,    8, false,   false,  0.75); 
	this.deadAnimation = new Animation(spritesheet,        448, 128,    64, 64, 0.1,    1, true,    false,  0.75);  
	this.animation = this.stillAnimation;

	this.name = "Player";
	this.game = game;
	this.ctx = game.ctx;  
	this.sound = game.sound;
 
	Entity.call(this, game, (width / 2) - 25, (height / 2 ) + 42);  
	this.height = 38;
	this.width = 33;
	this.textureOffset = 9;
	this.attackRadius = 32;


	this.lives = 200;
	this.speed = 150; 
	this.damage = 10;
	this.lastAttackTime = 0;
	this.attackFrameCounter = 0;
	this.isAttacking = false;
	this.deathFrameCounter = 0;
	this.isDying = false;
	this.programmingFrameCounter = 0;
	this.isProgramming = false;

	this.attackSound = document.createElement("audio");
	this.attackSound.src = "sound_effects/space_traveler_attack.mp3";
	this.attackSound.loop = false;

	this.damageSound = document.createElement("audio");
	this.damageSound.src = "sound_effects/space_traveler_damage.mp3";
	this.damageSound.loop = false;

	this.walkSound = document.createElement("audio");
	this.walkSound.src = "sound_effects/space_traveler_walking_right.mp3";
	this.walkSound.loop = false;
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.setImg = function (img) { 
	console.log(img);
	var spritesheet = AM.getAsset(img);
	//(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale)
	this.animation = new Animation(spritesheet,             0,  448,    64, 64, 0.1,    8, true,    false,  0.75);

	this.stillAnimation = new Animation(spritesheet,        0,  256,    64, 64, 0.1,    1, true,    false,  0.75);
	this.upAnimation = new Animation(spritesheet,           0,  448,    64, 64, 0.095,  8, true,    false,  0.75);
	this.downAnimation = new Animation(spritesheet,         0,  256,    64, 64, 0.095,  8, true,    false,  0.75);
	this.rightAnimation = new Animation(spritesheet,        0,  384,    64, 64, 0.095,  8, true,    false,  0.75);
	this.leftAnimation = new Animation(spritesheet,         0,  320,    64, 64, 0.095,  8, true,    false,  0.75);    
	this.attackAnimation = new Animation(spritesheet,       0,  0,      64, 64, 0.1,    8, false,    false,  0.75);    
	this.frontAttackAnimation = new Animation(spritesheet,  0,  0,      64, 64, 0.1,    8, true,    false,  0.75);    
	this.leftAttackAnimation = new Animation(spritesheet,   0,  512,      64, 64, 0.1,    8, true,    false,  0.75);    
	this.rightAttackAnimation = new Animation(spritesheet,  0,  64,     64, 64, 0.1,    8, true,    false,  0.75);
	this.programAnimation = new Animation(spritesheet,      0,  192,    64, 64, 0.1,    8, true,    false,  0.75);
	this.dyingAnimation = new Animation(spritesheet,        0,  128,    64, 64, 0.1,    8, false,   false,  0.75); 
	this.deadAnimation = new Animation(spritesheet,        448, 128,    64, 64, 0.1,    1, true,    false,  0.75);  
	this.animation = this.stillAnimation;
	Entity.prototype.update.call(this); 
};

Player.prototype.update = function () {
	var ticksPerAnimation = 95;
	var playerMoving = false;
	if (collideLeft(this) || collideRight(this)) { 
		if (collideLeft(this)) this.x = 0;
		if (collideRight(this)) this.x = width - this.width; 
	}

	if (collideTop(this) || collideBottom(this)) {
		if (collideTop(this)) this.y = 0;
		if (collideBottom(this)) this.y = height - this.height; 
	}  

 	if(this.lives > 0) {
		if (this.isAttacking) {
			this.attackFrameCounter += 1;
			this.animation = this.attackAnimation;
			for (var i = 0; i < this.game.hostileEntities.length; i++) {
				var ent = this.game.hostileEntities[i];
				if (this != ent && collide({x:this.x, y:this.y, radius:this.attackRadius}, ent) 
					&& this.game.keys.attack && (!this.lastAttackTime || (this.lastAttackTime < this.game.timer.gameTime - 0.5))) {
					ent.lives -= this.damage; 
					this.lastAttackTime = this.game.timer.gameTime;
					console.log("Player hit: " + ent.name + " for " + this.damage + " damage");
					this.sound.playDamageSound(ent); 
				}  
			}

			if (this.attackFrameCounter > ticksPerAnimation) {
				this.attackFrameCounter = 0;
				this.isAttacking = false;
			}
		} else if (this.isProgramming) {              
			this.game.removeProgramButtons();
			this.programmingFrameCounter += 1;
			this.animation = this.programAnimation;
			for (var i = 0; i < this.game.programmableEntities.length; i++) {
				var ent = this.game.programmableEntities[i];
				if (this != ent && !ent.removeFromWorld && collide({x:this.x, y:this.y, radius:this.attackRadius}, ent)) { 
						console.log("Programing " + ent.name + " " + ent.tier);  
					ent.setTask();
					 
				}  
			} 

			if (this.programmingFrameCounter > ticksPerAnimation) {
				this.programmingFrameCounter = 0;
				this.isProgramming = false;
			}
		} else{
			if(this.game.keys.up) {
				this.attackAnimation = this.frontAttackAnimation;
				this.animation = this.upAnimation;
				this.y -= this.game.clockTick * this.speed;  
				playerMoving = true;
			} else if (this.game.keys.down) {  
				this.attackAnimation = this.frontAttackAnimation;
				this.animation = this.downAnimation;
				this.y += this.game.clockTick * this.speed;
				playerMoving = true;
			} else if (this.game.keys.left) {
				this.attackAnimation = this.leftAttackAnimation;
				this.animation = this.leftAnimation; 
				this.x -= this.game.clockTick * this.speed;   
				playerMoving = true;
			} else if (this.game.keys.right) {
				this.attackAnimation = this.rightAttackAnimation;
				this.animation = this.rightAnimation;    
				this.x += this.game.clockTick * this.speed;
				playerMoving = true;    
			} else {
				this.attackAnimation = this.frontAttackAnimation;
				this.animation = this.stillAnimation;    
			} 
			if(this.game.keys.program) {
				this.isProgramming = true;
				this.animation = this.programAnimation;
				for (var i = 0; i < this.game.programmableEntities.length; i++) {
					var ent = this.game.programmableEntities[i];
					if (this != ent && !ent.removeFromWorld && collide({x:this.x, y:this.y, radius:this.attackRadius}, ent)) { 
						console.log("Programing " + ent.name + " " + ent.tier);   
						ent.setTask();
					}  
				} 
			}
			if(this.game.keys.attack) {
				this.sound.playAttackSound(this);
				this.isAttacking = true;
				this.attackFrameCounter += 1;
				this.animation = this.attackAnimation;
				for (var i = 0; i < this.game.hostileEntities.length; i++) {
					var ent = this.game.hostileEntities[i];
					if (this != ent && collide(this, ent) && this.game.keys.attack &&
						(!this.lastAttackTime || (this.lastAttackTime < this.game.timer.gameTime - 0.5))) {
							ent.lives -= this.damage; 
							this.lastAttackTime = this.game.timer.gameTime; 
							this.sound.playDamageSound(ent); 
					}  
				} 
			} 
			if(playerMoving) {
				if(!isPlaying(this.walkSound)) {
					this.sound.playWalkSound(this);
				}
			}
		} 
	} else {
		if (this.deathFrameCounter == 0) {
			this.isDying = true;
		}
		if (this.isDying) {
			this.animation = this.dyingAnimation;
			this.deathFrameCounter += 1;

			if(this.deathFrameCounter > ticksPerAnimation) {
				this.isDying = false;
			}
		} else {
			this.animation = this.deadAnimation;
		}
	} 
	Entity.prototype.update.call(this); 
};

Player.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.textureOffset); 
	Entity.prototype.draw.call(this); 
};