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
        
        powerUpsEffectTime: {[s: number]: number} = {};
        powerUpTakenTime: {[s: number]: number} = {};
        
        housesConnected: number = 0;
        missionStartTime: number = 0;
        score: number = 0;
        gameStarted: number;

        constructor(ps: PlayState, x: number, y: number) {
            super(ps.game, x, y, "car");
            this.anchor.setTo(0.5, 0.5);
            this.ps = ps;
            this.game.physics.p2.enableBody(this, false);
            var body: Phaser.Physics.P2.Body = this.body;
            body.setRectangle(this.SIZE.x, this.SIZE.y);
            body.mass = 2;
            game.add.existing(this);
            this.cable = null;
            this.gameStarted = game.time.totalElapsedSeconds();
            //Reset the power ups
            for(var i = 1; i<=PowerUp.NUMBER_OF_POWERUPS; i++)
            {
                this.powerUpTakenTime[i] = 0;
                this.powerUpsEffectTime[i]
            }
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
		    if (start && (this.cableUsed < this.maxCable)) {
			this.add_cable(1);
			this.ps.set_start_house(start);
		    }
		} else {
		    this.add_segment();
		}
	    }

	    // Manually do a check for 
            
            
            //Check the effects
            for(var i = 1; i<=PowerUp.NUMBER_OF_POWERUPS; i++)
            {
                if(this.powerUpTakenTime[i] + this.powerUpsEffectTime[i] < this.ps.game.time.totalElapsedSeconds())
                {
                    //Remove the effects
                    switch(i)
                    {
                    //Faster car
                    case 1:
                        this.MAX_SPEED = 20;
                        break;
                    }
                    this.powerUpsEffectTime[i] = 0;
                    this.powerUpTakenTime[i] = 0;
                }
            }
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
	    body.mass = .02;
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

	remove_cable() {
	    if (!this.cable) return;

	    // remove last constrain between this.last_segment and car
	    if(this.last_constraint)
		this.game.physics.p2.removeConstraint(this.last_constraint);

	    this.cable.destroy(true);
	    this.last_segment = null;
	    this.last_constraint = null;
	    this.cable = null;
	    this.game.physics.p2.getConstraints().forEach(function(c : any) { this.game.physics.p2.removeConstraint(c);} );

	    
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
        addEffect(type: number)
        {
            //Add the effect
            if(this.powerUpTakenTime[type] == 0)
            {
                this.powerUpTakenTime[type] = this.ps.game.time.totalElapsedSeconds();
                this.powerUpsEffectTime[type] = 20;
                switch(type)
                {
                case 1:
                    this.MAX_SPEED = 30;
                    break;
                }
            }
            else if(this.powerUpTakenTime[type] > 0)
            {
                this.powerUpsEffectTime[type] += 20;
            }
        }
    }
}