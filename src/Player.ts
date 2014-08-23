/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>
module states {
    export class Player extends Phaser.Sprite {
        cable		: Phaser.Group;
	last		: Phaser.Sprite;
        MAX_SPEED	: number = 10;
        ROTATION_SPEED	: number = 5;
        SIZE		: Phaser.Point = new Phaser.Point(32, 20);
	ps              : PlayState;
		
        constructor(ps: PlayState, x: number, y: number) {
            super(ps.game, x, y, "car");
            this.anchor.setTo(0.5, 0.5);
	    this.ps = ps;
            this.game.physics.p2.enableBody(this, false);
            var body: Phaser.Physics.P2.Body = this.body;
            body.setRectangle(this.SIZE.x, this.SIZE.y);
            body.mass = 1;
            game.add.existing(this);
            this.add_cable(50);
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
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
            {
                if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
                {
                    this.body.damping = 0.0;
                    this.body.applyForce([Math.cos(this.rotation) * -this.MAX_SPEED, Math.sin(this.rotation) * -this.MAX_SPEED], this.x + Math.cos(this.rotation) * this.SIZE.x / 2.0, this.y + Math.sin(this.rotation) * this.SIZE.y / 2.0);
                }
                if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
                {
                    this.body.damping = 0.0;
                    this.body.applyForce([Math.cos(this.rotation) * this.MAX_SPEED / 2.0, Math.sin(this.rotation) * this.MAX_SPEED / 2.0], this.x + Math.cos(this.rotation) * -this.SIZE.x / 2.0, this.y + Math.sin(this.rotation) * -this.SIZE.y / 2.0);
                }
            }
            else
            {
                this.body.damping = 0.7;
            }

        }


	add_cable(N : number)  {
            this.cable = this.game.add.group();
	    this.cable.enableBody = true;
	    this.cable.physicsBodyType = Phaser.Physics.P2JS;


	    var last : Phaser.Sprite = this;
	    var s  = 6;
	    for(var i : number = 0; i < N; i++) {
		var x = this.body.x + Math.cos(this.rotation + 3.14) * s;
		var y = this.body.y + Math.sin(this.rotation + 3.14) * s;
		var l = this.cable.create( x, y, 'cable');
		var body:Phaser.Physics.P2.Body = l.body;
		body.setRectangle(s,s);
		body.mass = .001;
		body.damping = .1;
		body.setMaterial(this.ps.CABLE_MATERIAL);
		var constraint = this.game.physics.p2.createDistanceConstraint(l, last, s, 10);
		this.cable.add(l);
		last = l;
		if(i == (N-1)) {
		    body.static = true;
		}
	    }

	}
    }
}