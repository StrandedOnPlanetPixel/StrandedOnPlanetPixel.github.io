var backgroundSong = document.createElement("audio");

function SoundManager() {
	//this.backgroundSong = document.createElement("audio");
	this.sounds = []
	this.audioToggle = null;
}

SoundManager.prototype.setupBackgroundMusic = function() {
	console.log("Music Started")
	backgroundSong.src = "audio/Module2.mp3";
	backgroundSong.loop = "true";
	backgroundSong.play();
	console.log(backgroundSong.paused)
	var audioToggle = document.getElementById("audioToggle").addEventListener("click", this.toggleBackgroundMusic); 
}

SoundManager.prototype.toggleBackgroundMusic = function() {
	console.log("Music toggled")
	if(backgroundSong.paused) {
		console.log("playing sound");
		backgroundSong.play();			
	} else {
		console.log("paused sound");
		backgroundSong.pause();
	}
}

SoundManager.prototype.playAttackSound = function(entity) {
	if (entity.attackSound != null) {
		entity.attackSound.play();
	}
}

SoundManager.prototype.playDamageSound = function(entity) {
	if (entity.damageSound != null) {
		entity.damageSound.play();
	}
}

SoundManager.prototype.playDeathSound = function(entity) {
	if (entity.deathSound != null) {
		entity.deathSound.play();
	}
}