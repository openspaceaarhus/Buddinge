/// <reference path="../lib/phaser.d.ts" />
module states {
    export class Player extends Phaser.Sprite {
        cable : Phaser.Group;
        MAX_SPEED: number = 10;
        ROTATION_SPEED: number = 5;
        SIZE: Phaser.Point = new Phaser.Point(32, 20);
        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, "car");
            this.anchor.setTo(0.5, 0.5);

            this.game.physics.p2.enableBody(this, false);
            var body: Phaser.Physics.P2.Body = this.body;
            body.setRectangle(this.SIZE.x, this.SIZE.y);
            body.mass = 1;
            game.add.existing(this);
            //this.add_cable();
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

	   add_cable() 
       {
            this.cable = this.game.add.group();

            var last : Phaser.Sprite  = this;
            for(var i = 0 ; i < 10 ; i++) 
            {
                var dx =  this.body.x + Math.cos(this.rotation + 180) * .10;
                var dy =  this.body.y + Math.sin(this.rotation + 180) * .10;
                
                if (i == 9) 
                    var  l = new  Phaser.Sprite(this.game, dx, dy, 'plug');
                else
                    var  l = new  Phaser.Sprite(this.game, dx, dy, 'particle');
                this.game.physics.p2.enableBody(l, false);
                if (last == this) {
                    var constraint = this.game.physics.p2.createDistanceConstraint(l, last, .1);  //createRevoluteConstraint(l , [-30.0, 0.0], last, [0.0, 1.0], 10.0);
                } else {
                    var constraint = this.game.physics.p2.createDistanceConstraint(l, last, 1);  //createRevoluteConstraint(l , [0.0, -10.0], last, [0.0, 1.0], 10.0);
                }
                l.body.mass = .001;

                this.cable.add(l);

                last = l;
            }
	   }
    }
}