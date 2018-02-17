var backgroundSong = document.createElement("audio");

function SoundManager() {
    //this.backgroundSong = document.createElement("audio");
    this.sounds = [];
    this.audioToggle = null;
}

SoundManager.prototype.setupBackgroundMusic = function() {
    console.log("Music Started");
    //this.backgroundSong.src = "audio/Module2.mp3";
    backgroundSong.src = "audio/Module2.mp3";
    //this.backgroundSong.loop = "true";
    backgroundSong.loop = "true";
    //this.backgroundSong.play();
    backgroundSong.play();
    console.log(backgroundSong.paused);
    var audioToggle = document.getElementById("audioToggle").addEventListener("click", this.toggleBackgroundMusic); 
    var volumeUp = document.getElementById("volumeUp").addEventListener("click", this.volumeUp); 
    var volumeDown = document.getElementById("volumeDown").addEventListener("click", this.volumeDown); 
};

SoundManager.prototype.toggleBackgroundMusic = function() {
    console.log("Music toggled");
    var audioToggleImage = document.getElementById("audioToggle"); 

    if(backgroundSong.paused) {
        console.log("playing sound");
        backgroundSong.play();          
        audioToggleImage.src = "img/pause.png";
    } else {
        console.log("paused sound");
        backgroundSong.pause();     
        audioToggleImage.src = "img/play.png";
    }
};

SoundManager.prototype.volumeUp = function() {
    // loop through each sound and increase sound????
    try {
        backgroundSong.volume += 0.1;
    } catch(err) {
        console.log("Max volume"); 
    }
 };

SoundManager.prototype.volumeDown= function() {
    // loop through each sound and decrease sound???    
    try {
        backgroundSong.volume -= 0.1;
    } catch(err) {
        console.log("Sound Muted"); 
    }
 };

SoundManager.prototype.playAttackSound = function(entity) {
    if (entity.attackSound != null) {
        entity.attackSound.play();
    }
};

SoundManager.prototype.playDamageSound = function(entity) {
    if (entity.damageSound != null) {
        entity.damageSound.play();
    }
};

SoundManager.prototype.playDeathSound = function(entity) {
    if (entity.deathSound != null) {
        entity.deathSound.play();
    }
};
