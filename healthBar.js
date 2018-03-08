function healthBar(game, x, y,  robot) {
	this.game = game;   
	this.ctx = game.ctx;     
	this.robot = robot;  
	//this.health = robot.lives;
	this.x = x;
	this.y = y;
	//this.maxHealth = 150; //magic number!!
 	ctx.fillStyle="#FF0000";
	Entity.call(this, game, x, y);
	this.radius = 16; 
}

healthBar.prototype = new Entity();
healthBar.prototype.constructor = healthBar;
 
healthBar.prototype.update = function () {  


	if (collideLeft(this)) {
		this.x += 40; 
		this.y += 50;
	}   
	if (collideRight(this)) {  
		this.x -= 40;
		this.y += 50;
	}

	if (collideTop(this)) { 
		this.y += 50;
	}

	if(collideBottom(this)) { 
		this.y -= 50;
	}
	
	//console.log((this.health/100)*50);
}

healthBar.prototype.draw = function (ctx) { 
 	//ctx.fillText("Life " + this.health+"/"+ maxHealth+" = " + percent * 100 +"%", this.x, this.y + 120); 
 
	ctx.strokeStyle="#000000";
    ctx.strokeRect(this.x,this.y,this.robot.game.state.robotMaxLives /2 ,5);
    ctx.fillRect(this.x,this.y,this.robot.lives / 2,5); 
	//console.log((this.health/100)*50);
	
 	Entity.prototype.draw.call(this);

}