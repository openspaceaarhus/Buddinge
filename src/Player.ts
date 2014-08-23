/// <reference path="../lib/phaser.d.ts" />
module states {
    export class Player extends Phaser.Sprite {
	cable : Phaser.Group;
        MAX_SPEED: number = 10;
        ROTATION_SPEED: number = 5;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, "car", 0);
            this.anchor.setTo(0.5, 0.5);
            this.animations.add("walk", [0, 1, 2, 3, 4], 10, true);

            this.game.physics.p2.enableBody(this, false);
            var body: Phaser.Physics.P2.Body = this.body;
            body.setRectangle(48, 32);
            game.add.existing(this);
	    this.add_cable();
        }

        update() 
        {
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
            {
                if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) 
                {
                    this.body.angularVelocity = -this.ROTATION_SPEED;
                }
                if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) 
                {
                    this.body.angularVelocity = this.ROTATION_SPEED;
                }
            }
            else
            {
                this.body.angularVelocity = 0;
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
            {
                this.body.damping = 0.0;
                this.body.applyForce([Math.cos(this.rotation) * -this.MAX_SPEED, Math.sin(this.rotation) * -this.MAX_SPEED], this.x, this.y);
            }
            else
            {
                this.body.damping = 0.7;
            }
        }

	add_cable() {
	    this.cable = this.game.add.group();

	    var last : Phaser.Sprite  = this;
	    for(var i = 0 ; i < 10 ; i++) {
                var dx =  this.body.velocity.x + Math.cos(this.rotation) * 15;
                var dy =  this.body.velocity.y + Math.sin(this.rotation) * 15;

		var  l = new  Phaser.Sprite(this.game, dx, dy, 'particle');
		this.game.physics.p2.enableBody(l, false);
		var constraint = this.game.physics.p2.createRevoluteConstraint(l , [0.0, -10.0], last, [0.0, 10.0], 20);
		l.body.mass = .1;

		this.cable.add(l);
		
		last = l;
	    }

	}
    }
}