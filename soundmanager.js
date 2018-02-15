function SoundManager() {
	this.backgroundSong = document.createElement("audio");
	this.sounds = []
}

SoundManager.prototype.setupBackgroundMusic = function() {
	console.log("Music Started")
	backgroundSong.src = "audio/Module2.mp3";
	backgroundSong.loop = "true";
	backgroundSong.play();
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