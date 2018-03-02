
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
};

Animation.prototype.drawFrame = function (tick, ctx, x, y, textureOffset = 0) {
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

	var locX = x - textureOffset;
	var locY = y - textureOffset;
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
		//if they are both circles
		if(ent.radius && otherEnt.radius) { 
			if(ent.y + ent.radius > otherEnt.y + otherEnt.radius) {
				ent.z = 2;
				otherEnt.z = 1;
			} else {
		 		ent.z = 1;
				otherEnt.z = 2;	 
			}
			return distance(ent, otherEnt) < ent.radius + otherEnt.radius;
		}   
		//if they are both boxes
		if(ent.height && otherEnt.height && ent.width && otherEnt.width) { 
			if(ent.y + ent.height > otherEnt.y + otherEnt.height) {
				ent.z = 2;
				otherEnt.z = 1;
			} else {
		 		ent.z = 1;
				otherEnt.z = 2;	 
			}
			return (ent.x < otherEnt.x + otherEnt.width 
				&& ent.x + ent.width > otherEnt.x 
				&& ent.y < otherEnt.y + otherEnt.height 
				&& ent.height + ent.y > otherEnt.y);
		}  

		//if ent is a square and otherEnt is a circle
		if(ent.height && otherEnt.radius && ent.width) { 			
			if(ent.y + ent.height > otherEnt.y + otherEnt.radius) {
				ent.z = 2;
				otherEnt.z = 1;
			} else {
		 		ent.z = 1;
				otherEnt.z = 2;	 
			}
			return intersects(otherEnt, ent);
		}

		//if ent is a circle and otherEnt is a square
		if(otherEnt.height && ent.radius && otherEnt.width) { 
			if(ent.y + ent.radius > otherEnt.y + otherEnt.height) {
				ent.z = 2;
				otherEnt.z = 1;
			} else {
		 		ent.z = 1;
				otherEnt.z = 2;	 
			}
			return intersects(ent, otherEnt);
		}

	}
};

function intersects(circle, rect) {
    var circleDistanceX = Math.abs(circle.x - rect.x);
    var circleDistanceY = Math.abs(circle.y - rect.y);

    if (circleDistanceX > (rect.width/2 + circle.radius) 
    	|| circleDistanceY > (rect.height/2 + circle.radius)) { 
    	return false; 
    }

    if (circleDistanceX <= (rect.width/2) 
    	|| circleDistanceY <= (rect.height/2)) { 
    	return true; 
    }
 
    var cornerDistance = (circleDistanceX - rect.width/2)^2 +(circleDistanceY - rect.height/2)^2;

    return (cornerDistance <= (circle.r^2));
}

function collideLeft(ent) {
	return ent.x < 0;
};

function collideRight(ent) {
	if(ent && ent.radius) {
		return (ent.x + ent.radius) > width;
	} else if(ent && ent.height && ent.width) {
		return (ent.x + ent.width) > width;
	} 
};

function collideTop(ent) {
	return (ent.y) < 0;
};

function collideBottom(ent) {
	if(ent && ent.radius) {
		return (ent.y + ent.radius) > height;
	} else if(ent && ent.height && ent.width) {
		return (ent.y + ent.height) > height;
	} 
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
	soundManager.playDamageSound(target);
};
 
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
  
function play() {
	if(gameEngine.gameOver) {
		startGame();
	} else if(!gameEngine.gameOver && gameEngine.started) {  // if the game had been paused
		canvas.focus();
		gameEngine.start();
		playButton.classList.add("playButtonHidden");	
		playButtonText.classList.add("playButtonHidden");
		playButton.style.display = "none";
		playButtonText.style.display = "none";   
		document.getElementById("gameWorld").style.opacity = "1";
	} else {  
		playButtonText.innerHTML = "Select your player!";
	 
		playButton.removeEventListener("click", play); 
		playButtonText.removeEventListener("click", play); 
		for(var i = 1; i <= 3; i++) {

			var img = document.createElement("img"); 
			img.src = "img/player" + i + ".png";
			img.alt = "img/space_traveler" + i + ".png";
			img.addEventListener("click", function() { 
				canvas.focus();
 				player.setImg(this.alt); 
 				gameEngine.start();  
 				playButton.classList.add("playButtonHidden");	 
 				playButtonText.classList.add("playButtonHidden"); 
 				playButton.style.display = "none";
 				playButtonText.style.display = "none";  
 				playButton.innerHTML = "<img id=\"playButton\" src=\"img/playGame.png\"/> ";
				playButton.appendChild(playButtonText);
	 			playButton.addEventListener("click", play);
	 			playButtonText.addEventListener("click", play);    
 				document.getElementById("gameWorld").style.opacity = "1";
			});
			playButton.appendChild(img);
		} 
	} 
};

function pause() {
	if(gameEngine.paused) {
		play();
	} else if(!gameEngine.gameOver) {
		gameEngine.pause();      
		playButton.classList.remove("playButtonHidden");	
		playButtonText.classList.remove("playButtonHidden"); 
		playButton.style.display = "";
		playButtonText.style.display = ""; 
		playButtonText.innerHTML = "Resume";      
		document.getElementById("gameWorld").style.opacity = "0.4";
	}
};

function gameOver() {	
	gameEngine.started = false;
	if(gameEngine.state.level === 5) { 
		if(gameEngine.gameOver) { 
			gameEngine.state.update();
		} else {
	 		gameEngine.gameOver = true; 
			playButton.classList.remove("playButtonHidden");	
			playButtonText.classList.remove("playButtonHidden");
			playButton.style.display = "";
			playButtonText.style.display = ""; 
			playButtonText.innerHTML = "You win! Click to play again?";      
			document.getElementById("gameWorld").style.opacity = "0.4";
		}  
	} else {
		if(gameEngine.gameOver) { 
			gameEngine.state.update();
		} else {
	 		gameEngine.gameOver = true; 
			playButton.classList.remove("playButtonHidden");		
			playButtonText.classList.remove("playButtonHidden");		
			playButton.style.display = "";
			playButtonText.style.display = ""; 
			playButtonText.innerHTML = "Game Over, Click to play again?";   
			playButtonText.style.fontSize = "25px";   
			document.getElementById("gameWorld").style.opacity = "0.4";
		} 
	}
};

function eatFood() { 
	canvas.focus();
	if(gameEngine.state.food >= 1 && gameEngine.state.player.lives < gameEngine.state.playerMaxLives) {
		gameEngine.state.food--;
		gameEngine.state.player.lives++;
	}
};

function addRobot() {
	canvas.focus();
	if(gameEngine.state.scrap >= 5 && gameEngine.state.minerals >= 5 && gameEngine.state.wood >= 5) {
		gameEngine.state.wood -= 5;
		gameEngine.state.scrap -= 5;
		gameEngine.state.minerals -= 5;  
		gameEngine.state.robotCount++;
		gameEngine.addProgrammableEntity(new Robot(gameEngine, 1), true);
		gameEngine.state.score += 1;
	}
};


function addEnivironmentEntities(gameEngine) {  
	var treeEnts = [new Tree(gameEngine, 64, 64), new Tree(gameEngine, 222, 55), new Tree(gameEngine, 130, 85), 
				new Tree(gameEngine, 305, 70), new Tree(gameEngine, 85, 160), new Tree(gameEngine, 155, 193), 
				new Tree(gameEngine, 305, 220)]; 

	for(var i = 0; i < treeEnts.length; i++) {
		gameEngine.addTreeEntity(treeEnts[i]);
	}

	var berryEnts = [new BerryBush(gameEngine, 320, 125), new BerryBush(gameEngine, 238, 140), new BerryBush(gameEngine, 215, 253),
				 new BerryBush(gameEngine, 44, 233), new BerryBush(gameEngine, 115, 340), new BerryBush(gameEngine, 315, 342),
				 new BerryBush(gameEngine, 245, 435), new BerryBush(gameEngine, 25, 535), new BerryBush(gameEngine, 95, 500), 
				 new BerryBush(gameEngine, 165, 615), new BerryBush(gameEngine, 279, 504)];
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
	
	rockEnts = [new Rock(gameEngine, 420, 100), new Rock(gameEngine, 430, 95), new Rock(gameEngine, 450, 95), new Rock(gameEngine, 475, 105),
	 			new Rock(gameEngine, 510, 100), new Rock(gameEngine, 510, 105), new Rock(gameEngine, 500, 110), new Rock(gameEngine, 525, 105),
	 			new Rock(gameEngine, 550, 100), new Rock(gameEngine, 545, 110), new Rock(gameEngine, 570, 110), new Rock(gameEngine, 580, 100),
	 			new Rock(gameEngine, 640, 100), new Rock(gameEngine, 650, 110),  new Rock(gameEngine, 665, 100),
	 			new Rock(gameEngine, 685, 95), new Rock(gameEngine, 700, 95), new Rock(gameEngine, 750, 95), new Rock(gameEngine, 790, 95), 
	 			new Rock(gameEngine, 725, 110), new Rock(gameEngine, 715, 105), new Rock(gameEngine, 740, 105), new Rock(gameEngine, 780, 105)];
	for(var i = 0; i < rockEnts.length; i++) {
		gameEngine.addRockEntity(rockEnts[i]);
	}
   
};

function isPlaying(song) {
    return song
        && song.currentTime > 0
        && !song.paused
        && !song.ended
        && song.readyState > 2;
}

var height = null;
var width = null; 
var gameEngine = null;
var player = null;
var canvas = null;
var ctx = null; 

var playButton = null;
var playButtonText = null;
var toDisplay = 1;
var playerSprites = 3;
var AM = new AssetManager(); 

AM.queueDownload("img/map.png");
AM.queueDownload("img/dusk.png");
AM.queueDownload("img/evening.png");
AM.queueDownload("img/midnight.png");
for(var i = 1; i <= playerSprites; i++) {
	AM.queueDownload("img/space_traveler" + i + ".png"); 
}
AM.queueDownload("img/scavenger.png");  
AM.queueDownload("img/tree.png");  
AM.queueDownload("img/metal.png"); 
AM.queueDownload("img/ship.png"); 
AM.queueDownload("img/bush.png");  
AM.queueDownload("img/building1.png"); 
AM.queueDownload("img/building2.png"); 
AM.queueDownload("img/building3.png"); 
AM.queueDownload("img/spaceship.png");
AM.queueDownload("img/robotSpriteSheet1.png");
AM.queueDownload("img/robotSpriteSheet7.png");
AM.queueDownload("img/rummager.png");
AM.queueDownload("img/alien.png");
AM.queueDownload("img/bullet.png");
AM.queueDownload("img/rock1.png");
AM.queueDownload("img/rock2.png");
AM.queueDownload("img/robot.png");
AM.queueDownload("img/robot2.png");
AM.queueDownload("img/plus.png");

AM.downloadAll(startGame);

var soundManager = new SoundManager();

function startGame() {  
	playButton = document.getElementById("button");
	playButtonText = document.getElementById("playGameText");
	canvas = document.getElementById("gameWorld");
	ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	playButton.addEventListener("click", play);
	playButtonText.addEventListener("click", play); 
	document.getElementById("addRobot").addEventListener("click", addRobot);
	document.getElementById("heal").addEventListener("click", eatFood);      
	ctx.canvas.addEventListener("keydown", function(e) {
		var keyPressed = String.fromCharCode(e.which); 
		if(keyPressed === 'P' || e.which === 80) pause(); 
		if(keyPressed === 'E' || e.which === 80) eatFood(); 
		if(keyPressed === 'R' || e.which === 80) addRobot(); 

		e.preventDefault(); 
	}, false);   

	height = canvas.height;
	width = canvas.width; 
	gameEngine = new GameEngine(); 
 
	gameEngine.init(ctx); 
	gameEngine.start();
	gameEngine.pause();

	player = new Player(gameEngine);
	var map = new Background(gameEngine); 
	var day = new Day(gameEngine, soundManager);
	var spaceship = new SpaceShip(gameEngine); 
	var state = new State(gameEngine, player, spaceship, day);
	
	gameEngine.state = state;

	var robot = new Robot(gameEngine, 1);

	gameEngine.addEntity(state);
	gameEngine.addEntity(map);  
	addEnivironmentEntities(gameEngine);
 
	gameEngine.addEntity(day);

	gameEngine.addNpcEntity(spaceship, true);   
	gameEngine.addNpcEntity(player, true);  
	gameEngine.addProgrammableEntity(robot, true);
	
	soundManager.setupBackgroundMusic();
	soundManager.playDaySong();

	console.log("All Done!");
};

window.addEventListener("focus", function(event) { 
 	canvas.focus();
}, false);
 