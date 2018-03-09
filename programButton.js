function ProgramButton(game, x, y, task, robot) {
	this.game = game;   
	this.ctx = game.ctx;     
	this.robot = robot;
	this.task = task;  
 	
 	if (this.task === this.robot.tasks[0] ) { // repair 
 		this.animation = new Animation(AM.getAsset("img/ship.png"), 0, 0, 160, 160, 0.1, 1, true, false, 0.20);
	} else if (this.task === this.robot.tasks[1]) { //gather berry 
		this.animation = new Animation(AM.getAsset("img/bush.png"), 0, 0, 64, 64, 0.1, 1, true, false, 0.50);
	} else if (this.task === this.robot.tasks[2]) { //gather scrap 
		this.animation = new Animation(AM.getAsset("img/metal.png"), 0, 0, 32, 32, 0.1, 1, true, false, 0.95);
	} else if (this.task === this.robot.tasks[3]) { //mining  
		this.animation = new Animation(AM.getAsset("img/rock1.png"), 0, 0, 32, 32, 0.1, 1, true, false, 1);
	} else if (this.task === this.robot.tasks[4]) { //logging 
 		this.animation = new Animation(AM.getAsset("img/tree.png"), 0, 0, 128, 128, 0.1, 1, true, false, 0.25);
	} else if (this.task === this.robot.tasks[5]) { //upgrade only show if you have enough resources
		this.animation = new Animation(AM.getAsset("img/robot2.png"), 0, 0, 64, 64, 0.1, 1, true, false, 0.50);
 	}    
	Entity.call(this, game, x, y);
	this.radius = 16; 
}

ProgramButton.prototype = new Entity();
ProgramButton.prototype.constructor = ProgramButton;
 
ProgramButton.prototype.update = function () {  

	if (collideLeft(this)) {
		this.x += 40; 
		this.y += 40;
	}   
	if (collideRight(this)) {  
		this.x -= 40;
		this.y += 40;
	}

	if (collideTop(this)) { 
		this.y += 40;
	}

	if(collideBottom(this)) { 
		this.y -= 40;
	}

	if(collide(this, this.game.mouse)) {
		document.getElementById("gameWorld").style.cursor = "pointer";      
	} else {
		document.getElementById("gameWorld").style.cursor = "";          
	}

	if(collide(this, this.game.click)) { 
		this.game.click = null;
		var lastTask = this.robot.task;
 		this.robot.task = this.task;
		if (this.task === this.robot.tasks[0] ) { // repair
			this.robot.taskEntity = this.game.state.ship;
		} else if (this.task === this.robot.tasks[1]) { //gather berry
			this.robot.taskEntity = this.game.bushEntities[Math.floor(Math.random() * this.game.bushEntities.length)];
		} else if (this.task === this.robot.tasks[2]) { //gather scrap
			this.robot.taskEntity = this.game.buildingEntities[Math.floor(Math.random() * this.game.buildingEntities.length)];
		} else if (this.task === this.robot.tasks[3]) { //mining 
			this.robot.taskEntity = this.game.rockEntities[Math.floor(Math.random() * this.game.rockEntities.length)];
		} else if (this.task === this.robot.tasks[4]) { //logging
			this.robot.taskEntity = this.game.treeEntities[Math.floor(Math.random() * this.game.treeEntities.length)];
		} else if (this.task === this.robot.tasks[5] && (gameEngine.state.scrap >= 10 
				&& gameEngine.state.minerals >= 10 && gameEngine.state.wood >= 10) && this.robot.tier === 1) {
			gameEngine.state.wood -= 10;
			gameEngine.state.scrap -= 10;
			gameEngine.state.minerals -= 10;   

			var upgradedSelf = new Robot(this.game, 2); 
			upgradedSelf.x = this.robot.x; 
			upgradedSelf.y = this.robot.y;  

			upgradedSelf.task = lastTask;
			upgradedSelf.taskEntity = this.robot.taskEntity;
			this.game.addProgrammableEntity(upgradedSelf, true);

			this.robot.removeFromWorld = true;
		} 
		this.game.removeProgramButtons();       
		document.getElementById("gameWorld").style.cursor = "";
	}  
};

ProgramButton.prototype.draw = function (ctx) { 
	if(this.task !== this.robot.tasks[5]) {
 		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
 		Entity.prototype.draw.call(this);

 	} else if (this.task === this.robot.tasks[5]) {
 		if((gameEngine.state.scrap >= 10 && gameEngine.state.minerals >= 10 && gameEngine.state.wood >= 10) && this.robot.tier === 1) {
			this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
			Entity.prototype.draw.call(this);
 		}
 	}
};