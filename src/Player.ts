/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>
module states {
    export class Player extends Phaser.Sprite {
        cable		: Phaser.Group;
        MAX_SPEED	: number = 20;
        ROTATION_SPEED	: number = 5;
        SIZE		: Phaser.Point = new Phaser.Point(24, 15);
	ps              : PlayState;
        cableUsed	: number = 0;
        maxCable    : number = 200;
	last_segment    : Phaser.Sprite;
	last_constraint  : any; //Phaser.Physics.P2.Constraint;
	SEGMENT_SIZE    : number = 5;
        SEGMENT_LENGTH: number = 1;

        constructor(ps: PlayState, x: number, y: number) {
            super(ps.game, x, y, "car");
            this.anchor.setTo(0.5, 0.5);
            this.ps = ps;
            this.game.physics.p2.enableBody(this, false);
            var body: Phaser.Physics.P2.Body = this.body;
            body.setRectangle(this.SIZE.x, this.SIZE.y);
            body.mass = .1;
            game.add.existing(this);
            this.cable = null;
        }

        update()  {
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))  {
                this.body.angularVelocity = -this.ROTATION_SPEED;
            } else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.angularVelocity = this.ROTATION_SPEED;
            }  else  {
                this.body.angularVelocity = 0;
	    }

            if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.body.damping = 0.0;
                this.body.applyForce([Math.cos(this.rotation) * -this.MAX_SPEED, Math.sin(this.rotation) * -this.MAX_SPEED], this.x + Math.cos(this.rotation) * this.SIZE.x / 2.0, this.y + Math.sin(this.rotation) * this.SIZE.y / 2.0);
            } else  if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.body.damping = 0.0;
                this.body.applyForce([Math.cos(this.rotation) * this.MAX_SPEED / 2.0, Math.sin(this.rotation) * this.MAX_SPEED / 2.0], this.x + Math.cos(this.rotation) * -this.SIZE.x / 2.0, this.y + Math.sin(this.rotation) * -this.SIZE.y / 2.0);
            } else {
                this.body.damping = 0.7;
	    }

	    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		if (!this.cable ) {
		    // check if this is a valid place to start a connection?
		    var start = this.ps.can_start_cable(this);
		    if (start) {
			this.add_cable(1);
			this.ps.set_start_house(start);
		    }
		} else {
		    this.add_segment();
		}
	    }

	    // Manually do a check for 
        }

	
	add_segment() {
            if(this.cableUsed >= this.maxCable)  {
		return;
            }
            this.cableUsed++;
	    var p2 = this.game.physics.p2;
	    // remove last constrain between this.last_segment and car
	    if(this.last_constraint)
		p2.removeConstraint(this.last_constraint);

	    // create a new segment Sprite
	    var x = this.body.x + Math.cos(this.rotation + 3.14) * this.SEGMENT_SIZE;
	    var y = this.body.y + Math.sin(this.rotation + 3.14) * this.SEGMENT_SIZE;
	    
	    var l = this.cable.create( x, y, 'cable');
	    var body:Phaser.Physics.P2.Body = l.body;
	    body.setRectangle(this.SEGMENT_SIZE, this.SEGMENT_SIZE);
	    body.mass = .01;
	    body.damping = .7;
	    body.setMaterial(this.ps.CABLE_MATERIAL);
            body.setCollisionGroup(this.ps.cableCollisionGroup);
            body.collides(this.ps.houseCollisionGroup);
	    
	    // add constrain between new segment and car + last segment and new segment
	    if(this != this.last_segment)  { 
		var constraint  = this.game.physics.p2.createDistanceConstraint(l, this.last_segment, this.SEGMENT_SIZE, 1000);
	    } else {
		// it must be acnhored to ze ground because it is the first segment
		body.static = true;
	    }
	    this.last_constraint = this.game.physics.p2.createDistanceConstraint(l, this, this.SEGMENT_SIZE, 1000);

	    // update last constrain and last segment
	    this.last_segment = l;
            this.bringToTop();
	}

	remove_segment() {

	}
	
	add_cable(N : number)  {        
            this.cable = this.game.add.group();
	    this.cable.enableBody = true;
	    this.cable.physicsBodyType = Phaser.Physics.P2JS;

	    this.last_segment  = this;
	    this.last_constraint = null;
	    
	    for(var i : number = 0; i < N; i++) {
		this.add_segment();
	    }
	}
    }
}