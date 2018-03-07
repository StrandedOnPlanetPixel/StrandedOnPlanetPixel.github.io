function Robot(game, tier) { //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, scale
	var img = "img/robotSpriteSheet1.png";
 	if(tier === 2) {
		img = "img/robotSpriteSheet7.png";
	}
	var spriteSheet = AM.getAsset(img);
	this.stillAnimation = new Animation(spriteSheet, 0, 0, 64, 64, 0.1, 1, true, false, 0.75);

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
	this.upAttackAnimation = new Animation(spriteSheet, 384, 832, 64, 64, 0.1, 6, true, false, 0.75);
	this.downAttackAnimation = new Animation(spriteSheet, 0, 128, 64, 64, 0.1, 6, true, false, 0.75);
	this.rightAttackAnimation = new Animation(spriteSheet, 0, 256, 64, 64, 0.1, 6, true, false, 0.75);
	this.leftAttackAnimation = new Animation(spriteSheet, 0, 384, 64, 64, 0.1, 6, true, false, 0.75);
	
	//charging animation
	this.chargeUpAnimation = new Animation(spriteSheet, 0, 448, 64, 64, 0.1 , 6, true, false, 0.75);
	this.chargeDownAnimation = new Animation(spriteSheet, 0, 576, 64, 64, 0.1, 6, true, false, 0.75);
	this.chargeRightAnimation =  new Animation(spriteSheet, 0, 768, 64, 64, 0.1, 6, true, false, 0.75);
	this.chargeLeftAnimation = new Animation(spriteSheet, 0, 832, 64, 64, 0.1, 6, true, false, 0.75);
	
	//powering down animation
	this.pDUpAnimation = new Animation(spriteSheet, 0, 896, 64, 64, 0.1, 6, true, false, 0.75);
	this.pDDownAnimation = new Animation(spriteSheet, 384, 768, 64, 64, 0.1, 6, true, false, 0.75);
	this.pDRightAnimation = new Animation(spriteSheet, 0, 960, 64, 64, 0.1, 6, true, false, 0.75);
	this.pDLeftAnimation = new Animation(spriteSheet, 384, 896, 64, 64, 0.1, 6, true, false, 0.75);
	
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
	
	this.animation = this.stillAnimation;

	//add rest
	this.name = "Robot";
	this.tier = tier;
	this.speed = 75;  
	this.game = game;
	this.ctx = game.ctx; 
	this.sound = game.sound;
	Entity.call(this, game, (width / 2) + 10, (height / 2 ) + 45);  

	this.height = 41;
	this.width = 32;
	this.textureOffset = 8;
	this.attackRadius = 32;

	this.taskEntity = null; 
	this.directions = ["left", "right", "up", "down"];
	this.tasks = ["repair", "gatherBerry", "gatherScrap"/*, "defend"*/, "mine", "log", "upgrade" /*"charge"*/ ];
	this.task = this.tasks[0];
	this.dead = false; 
	this.lives = 150; 
	this.visualRadius = 200;
	this.elapsedTime = 0;
	this.workspeed = 5;
	this.chargespeed = 2;
	this.charge = 100;
	this.day = this.game.state.day;
	this.damage = 10;

    this.attackSound = document.createElement("audio");
    this.attackSound.src = "sound_effects/robot_attack.mp3";
    this.attackSound.loop = false;

    this.damageSound = document.createElement("audio");
    this.damageSound.src = "sound_effects/robot_damage.mp3";
    this.damageSound.loop = false;

    this.deathSound = document.createElement("audio");
    this.deathSound.src = "sound_effects/robot_death.mp3";
    this.deathSound.loop = false;

    this.powerDownSound = document.createElement("audio");
    this.powerDownSound.src = "sound_effects/robot_power_down.mp3";
    this.powerDownSound.loop = false;
}

Robot.prototype = new Entity();
Robot.prototype.constructor = Robot;


Robot.prototype.setTask = function() {
	// sets the task of the robot
	//display menu 
	var menuX = this.x - 150;
	var menuY = this.y - 32;
 	for(var i = 0; i < this.tasks.length; i++) {
		menuX += 40;  
		this.game.addProgramButtonEntity(new ProgramButton(this.game, menuX, menuY, this.tasks[i], this));
	}
	
};

Robot.prototype.update = function() {
	
	if(!this.day){
		this.elapsedTime += this.game.clockTick;
		if(this.elapsedTime > this.chargespeed) {
			this.charge -= 1;
			this.elapsedTime = 0;
		}
		
	} else if (this.day && this.charge < 100){
		this.elapsedTime += this.game.clockTick;
		if(this.elapsedTime > this.chargespeed) {
			this.charge += 1;
			this.elapsedTime = 0;
		}
	}
	
	if (collideLeft(this) || collideRight(this)) { 
		if (collideLeft(this)) this.x = 0;
		if (collideRight(this)) this.x = width - this.width; 
	}

	if (collideTop(this) || collideBottom(this)) {
		if (collideTop(this)) this.y = 0;
		if (collideBottom(this)) this.y = height - this.height; 
	}
	
	if (this.charge <= 0){
		if(this.dir === this.directions[3]){
			this.animation = this.pDDownAnimation;
		} else if(this.dir === this.directions[0]){
			this.animation = this.pDLeftAnimation;      
		} else if(this.dir === this.directions[1]){
			this.animation = this.pDRightAnimation;     
		} else{
			this.animation = this.pDUpAnimation;
		}

		this.sound.playDeathSound(this);
	}
	
	if(this.lives <= 0) { 
		this.animation = this.dyingUpAnimation;

		if(this.dir === this.directions[3]){
			this.animation = this.dyingDownAnimation;
		} else if(this.dir === this.directions[0]){
			this.animation = this.dyingLeftAnimation;       
		} else if(this.dir === this.directions[1]){
			this.animation = this.dyingRightAnimation;      
		} else{
			this.animation = this.dyingUpAnimation;
		}
		this.sound.playDeathSound(this);
		this.removeFromWorld = true;
		this.game.state.robotCount--;
	}
	
	var closestEnt = this.game.hostileEntities[0];
	for (i = 0; i < this.game.hostileEntities.length; i++) {
		ent = this.game.hostileEntities[i];
		if (ent != this && collide({x: this.x, y: this.y, radius: this.visualRadius},
								   {x: ent.x, y: ent.y, radius: ent.visualRadius})) {
			var dist = distance(this, ent); 
			if(dist < distance(this, closestEnt)) {
				closestEnt = ent;
			}
		}  
	}  

	if(closestEnt && collide(this, {x: closestEnt.x, y: closestEnt.y, radius: this.attackRadius}) && closestEnt.lives > 0) {
		if(!this.lastAttackTime || (this.lastAttackTime < this.game.timer.gameTime - 1.5)) {
			//record last shot time and create the bullet.
			attack(this, closestEnt);
			this.lastAttackTime = this.game.timer.gameTime; 
		}
	} else if(closestEnt && collide(this,{x: closestEnt.x, y: closestEnt.y, radius: this.visualRadius}) && closestEnt.lives > 0) {
		moveEntityToTarget(this, closestEnt);	
	} else if(this.taskEntity && (!closestEnt || !collide(this,{x: closestEnt.x, y: closestEnt.y, radius: this.visualRadius}))) { // if the robot has been programmed
		// If the robot reaches its target entity 
		if(collide(this, this.taskEntity)) { 
			// fix repair directions;
			if (this.task === this.tasks[0] ) { // repair 
				var scrapCost = 5;
				var woodCost = 10;
				var mineralCost = 5;	
				// if tier 2 robot less resources are required
				if(this.tier == 2) {
					scrapCost = 3;
					woodCost = 5;
					mineralCost = 3;
				}
				if(this.game.state.scrap >= scrapCost && this.game.state.wood >= woodCost 
					&& this.game.state.minerals >= mineralCost){
					
					console.log("Upgrading damaged ship");

	
					this.game.state.ship.lives += this.tier; 
					this.game.state.score += this.tier;

					this.game.state.scrap -= scrapCost;
					this.game.state.wood -= woodCost;
					this.game.state.minerals -= mineralCost;
					if(this.game.state.ship.lives >= this.game.state.shipMaxHealth) {
						this.game.state.shipMaxHealth += 100;
						
						this.game.state.level += 1;
						if(this.game.state.level === 5) { // you win!
							gameOver();
						} else {
							this.sound.playLevelUpSound();
						}
					} 	
				} 				
		
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
				this.elapsedTime += this.game.clockTick;
				if(this.elapsedTime > this.workspeed) {
					if(this.game.state.food < this.game.state.maxFood) {
						this.game.state.food += (2 * this.tier); // i.e 2 if tier 1 or 4 if tier 2
						this.game.state.score +=  (2 * this.tier);
					}
					this.elapsedTime = 0;
				}
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
				this.elapsedTime += this.game.clockTick;
				if(this.elapsedTime > this.workspeed) {
					if(this.game.state.scrap < this.game.state.maxScrap) {
						this.game.state.scrap += (1 + this.tier); // i.e 2 if tier 1 or 3 if tier 2
						this.game.state.score += (1 + this.tier);
					}
					this.elapsedTime = 0;
				}
				if(this.dir === this.directions[3]){
					this.animation = this.gatherScrapDownAnimation;
				} else if(this.dir === this.directions[0]){
					this.animation = this.gatherScrapLeftAnimation;     
				} else if(this.dir === this.directions[1]){
					this.animation = this.gatherScrapRightAnimation;        
				} else{
					this.animation = this.gatherScrapUpAnimation;
				}
			} else if (this.task === this.tasks[4]) { //logging
				this.elapsedTime += this.game.clockTick;
				if(this.elapsedTime > this.workspeed) {
					if(this.game.state.wood < this.game.state.maxWood) {
						this.game.state.wood += (1 + this.tier); // i.e 2 if tier 1 or 3 if tier 2
						this.game.state.score += (1 + this.tier);
					}
					this.elapsedTime = 0;
				}
				if(this.dir === this.directions[3]){
					this.animation = this.loggingDownAnimation;
				} else if(this.dir === this.directions[0]){
					this.animation = this.loggingLeftAnimation;     
				} else if(this.dir === this.directions[1]){
					this.animation = this.loggingRightAnimation;        
				} else{
					this.animation = this.loggingUpAnimation;
				}
			} else if (this.task === this.tasks[3]) { //mining
				this.elapsedTime += this.game.clockTick;
				if(this.elapsedTime > this.workspeed) {
					if(this.game.state.minerals < this.game.state.maxMinerals) {
						this.game.state.minerals += (1 + this.tier); // i.e 2 if tier 1 or 3 if tier 2
						this.game.state.score += (1 + this.tier);
					}
					this.elapsedTime = 0;
				}
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
	}
	Entity.prototype.update.call(this);  
};

Robot.prototype.draw = function(){
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.textureOffset);  
	Entity.prototype.draw.call(this);
};