/// <reference path="../lib/phaser.d.ts" />
module states {
    export class Player extends Phaser.Sprite {

	cable : Phaser.Group;
	
        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, "car", 0);
            this.anchor.setTo(0.5, 0.5);
            this.animations.add("walk", [0, 1, 2, 3, 4], 10, true);
            game.physics.arcade.enableBody(this);
            game.add.existing(this);
        }

        update() 
        {
            this.animations.frame = 0;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.angularVelocity = 0;
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) 
            {
                this.body.angularVelocity = -200;
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) 
            {
                this.body.angularVelocity = 200;
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
            {
                this.body.velocity.x = Math.cos(this.rotation) * 150;
                this.body.velocity.y = Math.sin(this.rotation) * 150;
            }
        }

	add_cable() {
	    this.cable = this.game.add.group();

	    var last = this;
	    for(var i  0 ; i < 10 ; i_+++) {
		var  l = new  Phaser.Sprite(this.game, this.body.x, this.body.x);
		this.cable.add(l);

	    }
	    
	    

	}
    }
}