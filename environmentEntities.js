function BerryBush(game, x, y) {
	this.image = new Animation(AM.getAsset("img/bush.png"), 0, 0, 64, 64, 0.1, 1, true, false, 0.95);
	this.game = game;   
	this.ctx = game.ctx;     
	Entity.call(this, game, x, y);  
	this.radius = 30; 
	this.height = 25; 
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

function Building(game, x, y) {
	this.game = game;   
	this.ctx = game.ctx;    
	this.spritesheet = "img/building" + (Math.floor(Math.random() * 3) + 1) + ".png";
	this.height = 60;
	this.radius = 68; 
	this.task = 2;
	this.image = new Animation(AM.getAsset(this.spritesheet), 0, 0, 128, 140, 0.1, 1, true, false, 1);
	Entity.call(this, game, x, y); 
}

Building.prototype = new Entity();
Building.prototype.constructor = Building;

Building.prototype.update = function () { 
};

Building.prototype.draw = function (ctx) {   
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
};

function Rock(game, x, y) {
	this.image = new Animation(AM.getAsset("img/rock"+ (Math.floor(Math.random() * 2) + 1) + ".png"), 0, 0, 32, 32, 0.1, 1, true, false, 1.35);
	this.game = game;   
	this.ctx = game.ctx;     
	Entity.call(this, game, x, y);   
	this.radius = 16; 
	this.height = 16; 
	this.task = 3;
}

Rock.prototype = new Entity();
Rock.prototype.constructor = Rock;

Rock.prototype.update = function () { 
};

Rock.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.radius);
	Entity.prototype.draw.call(this);
};

function SpaceShip(game) {
	this.game = game;   
	this.ctx = game.ctx; 
	this.spritesheet = "img/spaceship.png";
	this.size = 160;
	this.image = new Animation(AM.getAsset(this.spritesheet), (0 * this.size), 0, 160, 160, 0.1, 1, true, false, 1);  


	this.height = 130;
	this.width = 110;
	this.textureOffset = 20; 

	this.lives = 500;
	Entity.call(this, game, width / 2 - 50, height / 2 - 50);
  
	Entity.prototype.draw.call(this);

    this.damageSound = document.createElement("audio");
    this.damageSound.src = "sound_effects/ship_damage.mp3";
    this.damageSound.loop = false;
}
 

SpaceShip.prototype = new Entity();
SpaceShip.prototype.constructor = SpaceShip;
 
SpaceShip.prototype.update = function () {   
	this.image = new Animation(AM.getAsset(this.spritesheet), (this.game.state.level * this.size), 0, 160, 160, 0.1, 1, true, false, 1);  
}; 

SpaceShip.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.textureOffset);
	Entity.prototype.draw.call(this);
};

function Tree(game, x, y) {
	this.image = new Animation(AM.getAsset("img/tree.png"), 0, 0, 128, 128, 0.1, 1, true, false, 0.95);
	this.game = game;   
	this.ctx = game.ctx;     

	this.height = 100;
	this.width = 85;
	this.textureOffset = 18;
	Entity.call(this, game, x - 55, y - 55);  
 
	//this.radius = 62; 
	this.task = 4;
}

Tree.prototype = new Entity();
Tree.prototype.constructor = Tree;

Tree.prototype.update = function () { 
};

Tree.prototype.draw = function (ctx) {
	this.image.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.textureOffset);
	Entity.prototype.draw.call(this);
};