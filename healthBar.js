function healthBar(game, parent) {
	this.game = game;   
	this.ctx = game.ctx;     
	this.parent = parent;   
	this.x = this.parent.textureOffset ? this.parent.x - 8 : this.parent.x - 24;
	this.y = this.parent.textureOffset ? this.parent.y - 16 : this.parent.y - 32;
	this.parentMaxLives = this.parent.lives;
	Entity.call(this, game, this.x, this.y);
	this.radius = 16; 
}

healthBar.prototype = new Entity();
healthBar.prototype.constructor = healthBar;
 
healthBar.prototype.update = function () {  

	this.x = this.parent.textureOffset ? this.parent.x - 8 : this.parent.x - 24;
	this.y = this.parent.textureOffset ? this.parent.y - 16 : this.parent.y - 32;

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

	if(this.parent.removeFromWorld) {
		this.removeFromWorld = true;
	}
	
	Entity.prototype.update.call(this); 
}

healthBar.prototype.draw = function (ctx) {  
	ctx.strokeStyle="#000000";

	var percentage =  this.parent.lives / this.parentMaxLives * 48;

    ctx.strokeRect(this.x, this.y, 48, 6);
   	ctx.fillStyle="#bc3b34";
    ctx.fillRect(this.x, this.y, percentage, 6);  
	
 	Entity.prototype.draw.call(this);

}