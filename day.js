function Day(game) { 
	this.game = game;   
	this.sound = game.sound;
	this.ctx = game.ctx;  
	this.duskImage = "img/dusk.png";  
	this.eveningImage = "img/evening.png";  
	this.midnightImage = "img/evening.png";
	this.image = null;
 
	this.elapsedTime = 0;
	this.dayLength = 200; 
	this.day = true;
	this.time = "2:00";
	this.lastSpawnTime = 0;
	this.spawnRate = (2 * (4) + 0.5);
	Entity.call(this, game, 0, 0);
}

Day.prototype = new Entity();
Day.prototype.constructor = Day;
 
Day.prototype.update = function () {  
	this.elapsedTime += this.game.clockTick;
	if(this.elapsedTime > this.dayLength) {
		// nighttime has ended and now it is day
		this.lastSpawnTime = 0;
		this.elapsedTime = 0;
		this.image = null;
		this.day = true;
	} else if(this.elapsedTime > (this.dayLength * 0.60) ){
		this.image = this.midnightImage;
	} else if(this.elapsedTime > (this.dayLength * 0.55) || this.elapsedTime > (this.dayLength * 0.90)) {
		this.image = this.eveningImage; 
	} else if(this.elapsedTime > (this.dayLength * 0.50) || this.elapsedTime > (this.dayLength * 0.95)) {
 		this.image = this.duskImage;    
		this.day = false;
	}  

	var t = Math.floor(this.elapsedTime); 
	var min = (t % 40);
	var hr = Math.floor(t / 20) - 4; // clock offset
	if(hr >= 13) {  
		hr -= 12;
	} else if(hr <= 0) {
		hr = 12 + hr;
	}
	if(Math.floor(min / 10) === 0) {
		this.time = hr + ":0" + min;
	} else {
		this.time = hr + ":" + min;
	}

	this.spawnRate = 16 - (this.game.state.level + 1);  
	if(this.game.state.level >= 4) {
		this.spawnRate -= 0.5; // get rid of the + 0.5 on the last two levels.
	}

	if(!this.day) {    
		this.sound.playNightSong();

		console.log(this.spawnRate);
		if(this.elapsedTime - this.spawnRate > (this.lastSpawnTime)) { 
			this.lastSpawnTime = this.elapsedTime;
			this.elaspedTime = 0;
			var spawnType = Math.floor(Math.random() * Math.floor(3));
			if(spawnType === 0) {
				this.game.addNpcEntity(new Rummager(this.game), false);
			} else if(spawnType === 1) {
				this.game.addNpcEntity(new Alien(this.game), false);
			} else if(spawnType === 2) {
				this.game.addNpcEntity(new Scavenger(this.game), false);
			}  
		} 
	} else {
		this.sound.playDaySong(); 
		if(this.elapsedTime - this.spawnRate > (this.lastSpawnTime)) { 
			this.lastSpawnTime = this.elapsedTime;
			this.game.addNpcEntity(new Alien(this.game), false);
		}
	}
};

Day.prototype.draw = function (ctx) { 
	if(this.image) {
		ctx.drawImage(AM.getAsset(this.image), 0, 0);
	}
	Entity.prototype.draw.call(this);
};