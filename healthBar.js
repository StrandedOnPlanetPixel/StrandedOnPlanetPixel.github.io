function healthBar(game, x, y,  robot) {
	this.game = game;   
	this.ctx = game.ctx;     
	this.robot = robot;  
	this.health = robot.lives;
	this.x = x;
	this.y = y;
 	
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
	
	
}

healthBar.prototype.draw = function (ctx) { 
	ctx.fillStyle="#FF0000";
	ctx.fillRect(this.x,this.y + 120 ,(this.health/100)*50,5);
 	Entity.prototype.draw.call(this);

}