window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (/* function */ callback, /* DOMElement */ element) {
				window.setTimeout(callback, 1000 / 60);
			};
})(); 

/** Game Engine **/
function GameEngine() { 
	this.showOutlines = true;

	this.entities = [];
	this.environmentEntities = [];
	this.npcEntities = [];
	this.friendlyEntities = [];
	this.rockEntities = [];
	this.treeEntities = [];
	this.bushEntities = [];
	this.buildingEntities = [];
	this.hostileEntities = [];
	this.programmableEntities = [];
	this.programmableButtonEntities = [];
	this.ctx = null;
	this.level = null;
	this.dayLength = null;
	this.width = null;
	this.height = null; 
	
	this.state = null; 
	this.gameOver = false;
	this.click = {x: 0, y: 0,radius: 0};
	this.mouse = {x: 0, y: 0,radius: 0};
  
	this.showOutlines = false;
	this.paused = false;
	this.started = false;
	this.keys = {
		up: false,
		down: false,
		left: false,
		right: false,
		attack: false,
		program: false
	}; 
}

GameEngine.prototype.init = function (ctx) {
	this.ctx = ctx;
	this.width = this.ctx.canvas.width;
	this.height = this.ctx.canvas.height;
	this.keyListener();
	this.timer = new Timer();
	console.log("game initialized"); 
};

GameEngine.prototype.start = function () {
	console.log("starting game");   
	if(this.paused) {
		this.started = true;
		this.paused = false;
		this.timer.clockTick -= this.pausedTime;
	}
	var that = this;
	(function gameLoop() {
		that.loop();
		requestAnimFrame(gameLoop, that.ctx.canvas);
	})();
};

GameEngine.prototype.pause = function () {
	console.log("pausing game");       
	this.pausedTime = this.timer.clockTick;
	this.paused = true;    
};

GameEngine.prototype.removeProgramButtons = function () {
	for(var i = 0; i < this.programmableButtonEntities.length; i++) {
		this.programmableButtonEntities[i].removeFromWorld = true;
	}
};

GameEngine.prototype.keyListener = function() {
	var getXandY = function(e) {
		var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
		var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
		 return {x: x, y: y, radius: 1};
	};

	var that = this;
	this.ctx.canvas.addEventListener("keydown", function(e) {
		var keyPressed = String.fromCharCode(e.which); 
		if(keyPressed === 'W' || e.which === 38) that.keys.up = true;
		if(keyPressed === 'A' || e.which === 37) that.keys.left = true;  
		if(keyPressed === 'D' || e.which === 39) that.keys.right = true;  
		if(keyPressed === 'S' || e.which === 40) that.keys.down = true; 
		if(keyPressed === ' ') that.keys.attack = true; 
		if(keyPressed === 'Q') that.keys.program = true; 
		e.preventDefault(); 
	}, false);  

	this.ctx.canvas.addEventListener("keyup", function(e) {
		var keyReleased = String.fromCharCode(e.which); 
		if(keyReleased === 'W' || e.which === 38) that.keys.up = false;
		if(keyReleased === 'A' || e.which === 37) that.keys.left = false;  
		if(keyReleased === 'D' || e.which === 39) that.keys.right = false;  
		if(keyReleased === 'S' || e.which === 40) that.keys.down = false; 
		if(keyReleased === ' ') that.keys.attack = false; 
		if(keyReleased === 'Q') that.keys.program = false; 
		e.preventDefault(); 
	}, false);  

	this.ctx.canvas.addEventListener("click", function (e) {
		that.click = getXandY(e);  
	}, false);

	this.ctx.canvas.addEventListener("mousemove", function (e) {
		that.mouse = getXandY(e);  
	}, false);
};
	
GameEngine.prototype.addEntity = function(entity) {
	console.log('added entity');
	this.entities.push(entity);
};

GameEngine.prototype.addProgramButtonEntity = function(entity) { 
	this.entities.push(entity);
	this.programmableButtonEntities.push(entity);
};

GameEngine.prototype.addNpcEntity = function(entity, friendly) {
	console.log('added npc entity');
	this.entities.push(entity);
	this.npcEntities.push(entity);
	if(friendly) {
		this.friendlyEntities.push(entity);
	} else {
		this.hostileEntities.push(entity);
	}
};

GameEngine.prototype.addProgrammableEntity = function(entity) {
	console.log('added programmable entity');
	this.entities.push(entity);
	this.npcEntities.push(entity); 
	this.friendlyEntities.push(entity); 
	this.programmableEntities.push(entity);
};


GameEngine.prototype.addRockEntity = function(entity) {
	console.log('added rock entity');
	this.entities.push(entity);
	this.rockEntities.push(entity);
	this.environmentEntities.push(entity);
}

GameEngine.prototype.addTreeEntity = function(entity) {
	console.log('added tree entity');
	this.entities.push(entity);
	this.treeEntities.push(entity);
	this.environmentEntities.push(entity);
};   

GameEngine.prototype.addBushEntity = function(entity) {
	console.log('added bush entity');
	this.entities.push(entity);
	this.bushEntities.push(entity);
	this.environmentEntities.push(entity);
};   

GameEngine.prototype.addBuildingEntity = function(entity) {
	console.log('added building entity');
	this.entities.push(entity);
	this.buildingEntities.push(entity);
	this.environmentEntities.push(entity);
};
	
GameEngine.prototype.addEnvironmentEntity = function(entity) {
	console.log('added an environment entity');    
	this.entities.push(entity);
	this.environmentEntities.push(entity);
};
 

GameEngine.prototype.draw = function () {
	this.ctx.clearRect(0, 0, this.width, this.height);
	this.ctx.save();
	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].draw(this.ctx);
	}  
	this.ctx.restore();
};

GameEngine.prototype.update = function () {
	var entitiesCount = this.entities.length;
 
	for (var i = 0; i < entitiesCount; i++) {
		var entity = this.entities[i];
		if (!entity.removeFromWorld) {
			entity.update();
		}
	}

	for (var i = this.entities.length - 1; i >= 0; --i) {
		if (this.entities[i].removeFromWorld) {
			this.entities.splice(i, 1); 
		}
	}

	for (var i = this.friendlyEntities.length - 1; i >= 0; --i) {
		if (this.friendlyEntities[i].removeFromWorld) {
			this.friendlyEntities.splice(i, 1); 
		}
	}

	for (var i = this.hostileEntities.length - 1; i >= 0; --i) {
		if (this.hostileEntities[i].removeFromWorld) {
			this.hostileEntities.splice(i, 1); 
		}
	}

};

GameEngine.prototype.loop = function () { 
	this.clockTick = this.timer.tick();   
	if(!this.paused && !this.gameOver) {
		this.update();
	}
	this.draw();
}; 
 
/** Timer **/
function Timer() {
	this.gameTime = 0;
	this.maxStep = 0.05;
	this.wallLastTimestamp = 0;
};

Timer.prototype.tick = function () {
	var wallCurrent = Date.now();
	var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
	this.wallLastTimestamp = wallCurrent;
  
	var gameDelta = Math.min(wallDelta, this.maxStep);
	this.gameTime += gameDelta;
	return gameDelta;
}; 

/** Entity **/
function Entity(game, x, y) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.z = 0;
	this.removeFromWorld = false;
}

Entity.prototype.update = function () {
};

Entity.prototype.draw = function (ctx) {
	if (this.game.showOutlines) {
		if(this.radius) {
			this.game.ctx.beginPath();
			this.game.ctx.strokeStyle = "yellow";
			this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			this.game.ctx.stroke();
			this.game.ctx.closePath();
		} 
		if(this.visualRadius) { 
			this.game.ctx.beginPath();
			this.game.ctx.strokeStyle = "red";
			this.game.ctx.arc(this.x + this.visualRadius/12, this.y + this.visualRadius/12, this.visualRadius, 0, Math.PI * 2, false);
			this.game.ctx.stroke();
			this.game.ctx.closePath();
		}

		if(this.attackRadius) { 
			this.game.ctx.beginPath();
			this.game.ctx.strokeStyle = "purple";
			this.game.ctx.arc(this.x + this.attackRadius/2, this.y + this.attackRadius/2, this.attackRadius, 0, Math.PI * 2, false);
			this.game.ctx.stroke();
			this.game.ctx.closePath();
		}
		if(this.height && this.width) {
			this.game.ctx.beginPath();
			this.game.ctx.strokeStyle = "blue";
			this.game.ctx.rect(this.x, this.y, this.width, this.height);
			this.game.ctx.stroke();
			this.game.ctx.closePath();
		}
	}
};

Entity.prototype.rotateAndCache = function (image, angle) {
	var offscreenCanvas = document.createElement('canvas');
	var size = Math.max(image.width, image.height);
	offscreenCanvas.width = size;
	offscreenCanvas.height = size;
	var offscreenCtx = offscreenCanvas.getContext('2d');
	offscreenCtx.save();
	offscreenCtx.translate(size / 2, size / 2);
	offscreenCtx.rotate(angle);
	offscreenCtx.translate(0, 0);
	offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
	offscreenCtx.restore();
	return offscreenCanvas;
};
 
 
Array.prototype.get = function(index) {
  return this[index];
}

Array.prototype.set = function(index, value) {
  this[index] = value;
}