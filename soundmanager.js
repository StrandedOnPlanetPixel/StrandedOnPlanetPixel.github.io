var backgroundSong = document.createElement("audio");
var daySongs = ["audio/daysong1.mp3", "audio/daysong2.mp3"];
var nightSongs = ["audio/nightsongfast.mp3"];
var currentVolume = 1;
var cachedVolume = 1;
var isDay = false;

function SoundManager() {
    //this.backgroundSong = document.createElement("audio");
    this.sounds = [];
    this.audioToggle = null;
}

SoundManager.prototype.playDaySong = function() {
    if(!isDay) {
        isDay = true;
        var songNum = Math.floor(Math.random()*Math.floor(daySongs.length));
        console.log("Play day song ", songNum);
        backgroundSong.src = daySongs[songNum];
        backgroundSong.loop = "true";
        if(!currentVolume == 0) {
            backgroundSong.play();
        }
    }
    
};

SoundManager.prototype.playNightSong = function() {
    if(isDay) {
        isDay = false;
        var songNum = Math.floor(Math.random()*Math.floor(nightSongs.length));
        console.log("Play night song ", songNum);
        backgroundSong.src = nightSongs[songNum];
        backgroundSong.loop = "true";
        if(!currentVolume == 0) {
            backgroundSong.play();
        }
    }
};

SoundManager.prototype.setupBackgroundMusic = function() {
    console.log("Music Started");
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
        currentVolume = cachedVolume;
    } else {
        console.log("paused sound");
        backgroundSong.pause();     
        audioToggleImage.src = "img/play.png";
        cachedVolume = currentVolume;
        currentVolume = 0;
    }
};

SoundManager.prototype.volumeUp = function() {
    // loop through each sound and increase sound????
    try {
        backgroundSong.volume += 0.1;
        currentVolume += 0.1;
    } catch(err) {
        console.log("Max volume"); 
    }
 };

SoundManager.prototype.volumeDown = function() {
    // loop through each sound and decrease sound???    
    try {
        backgroundSong.volume -= 0.1;
        currentVolume -= 0.1;
    } catch(err) {
        console.log("Sound Muted"); 
    }
 };

SoundManager.prototype.playAttackSound = function(entity) {
    if (entity.attackSound != null) {
        entity.attackSound.volume = currentVolume;
        entity.attackSound.play();
    }
};

SoundManager.prototype.playDamageSound = function(entity) {
    if (entity.damageSound != null) {
        entity.damageSound.volume = currentVolume;
        entity.damageSound.play();
    }
};

SoundManager.prototype.playDeathSound = function(entity) {
    if (entity.deathSound != null) {
        entity.deathSound.volume = currentVolume;
        entity.deathSound.play();
    }
};

SoundManager.prototype.playWalkSound = function(entity) {
    if (entity.walkSound != null) {
        entity.walkSound.volume = currentVolume;
        entity.walkSound.play();
    }
};