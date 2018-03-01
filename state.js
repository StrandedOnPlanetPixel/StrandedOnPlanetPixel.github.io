function State(game, player, ship, day) {
	this.player = player;
	this.ship = ship;
	this.day = day; 

	this.level = 0; // change this to "upgrade" the spaceship (0 to 4)
	this.score = 0;

	this.wood = 0;
	this.food = 0;
	this.scrap = 0;
	this.minerals = 0;

	this.maxWood = 999;
	this.maxFood = 999;
	this.maxScrap = 999;
	this.maxMinerals = 999;

	this.robotCount = 1;
	this.maxRobots = 999;

	this.shipMaxHealth = this.ship.lives;
	this.playerMaxLives = this.player.lives;
}

State.prototype = new Entity();
State.prototype.constructor = State;
 
State.prototype.update = function () {  
		if(this.day.day) {
			document.getElementById("time").innerHTML =  "<p>Day</p> <div> <img src=\"img/day.png\"/></div>"; 
		} else {
			document.getElementById("time").innerHTML =  "<p>Night</p> <div> <img src=\"img/night.png\"/></div>"; 
		}
		document.getElementById("woodCount").innerHTML = "<img src=\"img/tree.png\"/>" + this.wood;
		document.getElementById("foodCount").innerHTML = "<img src=\"img/bush.png\"/>" + this.food; 
		document.getElementById("metalCount").innerHTML = "<img src=\"img/metal.png\"/>" + this.scrap; 
		document.getElementById("mineralCount").innerHTML = "<img src=\"img/rock1.png\"/>" + this.minerals; 
		document.getElementById("robotCount").innerHTML = "<img src=\"img/robot.png\"/>" + this.robotCount; 
		document.getElementById("level").innerHTML = this.level + 1; 
		document.getElementById("score").innerHTML = this.score; 

		this.player.lives = this.player.lives <= 0 ? 0 : this.player.lives;
		this.ship.lives = this.ship.lives <= 0 ? 0 : this.ship.lives;
		this.robotCount = this.robotCount <= 0 ? 0 : this.robotCount;
	 	
	 	if(100 * (this.ship.lives / this.shipMaxHealth) < 20) { // 20%
	 		document.getElementById("shipHealth").style.color = "red";
	 	} else {
	 		document.getElementById("shipHealth").style.color = "";
	 	}

		document.getElementById("shipHealth").style.width = "" + 100 * (this.ship.lives / this.shipMaxHealth) + "%";
		document.getElementById("shipHealth").innerHTML = this.ship.lives + "/" + this.shipMaxHealth; 

	 	if(100 * (this.player.lives / this.playerMaxLives) < 20) {
	 		document.getElementById("playerHealth").style.color = "red";
	 	} else {
	 		document.getElementById("playerHealth").style.color = "";
	 	} 

		document.getElementById("playerHealth").style.width = "" + 100 * (this.player.lives / this.playerMaxLives) + "%";
		document.getElementById("playerHealth").innerHTML = this.player.lives + "/" + this.playerMaxLives; 

		if(this.ship.lives <= 0 || this.player.lives <= 0 || this.robotCount <= 0) {
			gameOver();
		}

};

State.prototype.draw = function (ctx) {  
};