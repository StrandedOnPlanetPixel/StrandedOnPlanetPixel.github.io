var backgroundSong = document.createElement("audio");

function SoundManager() {
	//this.backgroundSong = document.createElement("audio");
	this.sounds = []
	this.audioToggle = null;
}

SoundManager.prototype.setupBackgroundMusic = function() {
	console.log("Music Started")
	//this.backgroundSong.src = "audio/Module2.mp3";
	backgroundSong.src = "audio/Module2.mp3";
	//this.backgroundSong.loop = "true";
	backgroundSong.loop = "true";
	//this.backgroundSong.play();
	backgroundSong.play();
	console.log(backgroundSong.paused)
	var audioToggle = document.getElementById("audioToggle").addEventListener("click", this.toggleBackgroundMusic); 
	var volumeUp = document.getElementById("volumeUp").addEventListener("click", this.volumeUp); 
	var volumeDown = document.getElementById("volumeDown").addEventListener("click", this.volumeDown); 
}

SoundManager.prototype.toggleBackgroundMusic = function() {
	console.log("Music toggled")
	var audioToggleImage = document.getElementById("audioToggle"); 

	if(backgroundSong.paused) {
		console.log("playing sound");
		//this.backgroundSong.play();
		backgroundSong.play();			
		audioToggleImage.src = "img/pause.png";
	} else {
		console.log("paused sound");
		//this.backgroundSong.pause();
		backgroundSong.pause();		
		audioToggleImage.src = "img/play.png";

	}
}

SoundManager.prototype.volumeUp = function() {
	// loop through each sound and increase sound????
	console.log("volumeUp");

 }

SoundManager.prototype.volumeDown= function() {
	// loop through each sound and decrease sound???	
	console.log("volumeDown");
 }