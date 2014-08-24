/// <reference path="../lib/phaser.d.ts" />
/// <reference path="Player.ts"/>
/// <reference path="House.ts"/>
/// <reference path="PowerUp.ts"/>
/// <reference path="BadCar.ts"/>
module states {

    
    export class PlayState extends Phaser.State {    
        
        HOUSE_SIZE: number =  48;
        HOUSE_SPACE: number = 56;

	HOUSE_MATERIAL : Phaser.Physics.P2.Material;
	CABLE_MATERIAL : Phaser.Physics.P2.Material;

        emitter: Phaser.Particles.Arcade.Emitter;

        player: Player;   
        badCar: BadCar;
        
        lastPowerUpSpawn: number = 0;
        
        houseGroup: Phaser.Group;
        houseCollisionGroup: Phaser.Physics.P2.CollisionGroup;
        cableCollisionGroup: Phaser.Physics.P2.CollisionGroup;
        playerCollisionGroup: Phaser.Physics.P2.CollisionGroup;
        
        collideSound: Phaser.Sound;
        motorSound: Phaser.Sound;
        powerupSound: Phaser.Sound;
	dingSound: Phaser.Sound;
        
        nextMotorPlay: number;
        nextPuff: number;
        
        cableUsedText: Phaser.Text;
        
        activeEffectsIcon: Phaser.Sprite;
        activeEffectsText: Phaser.Text;
        
	houseA		: House = null;
	houseB		: House = null;
	start_house	: House = null;
	end_house	: House = null;

	mission_time : number = 30;

	can_start_cable(p : Player) : House {
	    if (this.houseB || this.houseA) {
		if (this.houseA.house_hitbox(p)) {
		    return this.houseA;
		} else if (this.houseB.house_hitbox(p)) {
		    return this.houseB;
		}
	    }
	    return null;
	}

	set_start_house(house:House) {
	    this.start_house = house;
	    this.end_house = this.houseA == house ? this.houseB : this.houseA;
	}

	end_mission() {
	    this.houseA = null;
	    this.houseB = null;

	    this.dingSound.play();
	    this.start_house.celebrate();
	    this.end_house.celebrate();

	    // make ready for next mission
	    this.start_house = null;
	    this.end_house = null;
	    this.player.remove_cable();

	    // create next mission ?
	    this.create_mission();
            
            this.player.housesConnected += 2;
	    var dt = this.game.time.totalElapsedSeconds() - this.player.missionStartTime;
            this.player.score += this.mission_time - dt;
	    if (dt < this.mission_time *.1) // bonus
		this.player.score + 20;
	}

	
	shuffle(array : number[]) : number[] {
	    var currentIndex = array.length, temporaryValue, randomIndex ;
	    
	    // While there remain elements to shuffle...
	    while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	    }
	    return array;
	}

	mission_list : number[] = null;
	mission_idx : number = 0;
	
	create_mission() {
	    if (this.houseB || this.houseA) return; // means that a mission is active
	    var mission_list = this.mission_list;
	    if (! mission_list) {
		mission_list = new Array<number>();
		for(var i : number = 0; i < this.houseGroup.countLiving(); i++) {
		    mission_list[mission_list.length] = i;
		}
		mission_list = this.shuffle(mission_list);
	    }

	    if (this.mission_idx +2 >= mission_list.length) {
		console.log("no more missions on this level");
		this.game.state.start("end");
		return;
	    }
	    this.houseA =  <House> this.houseGroup.getAt(mission_list[this.mission_idx]);
	    this.houseB =  <House> this.houseGroup.getAt(mission_list[this.mission_idx+1]);
	    this.mission_idx += 2;
	    this.houseA.hilight_house();
	    this.houseB.hilight_house();
            this.player.missionStartTime = this.game.time.totalElapsedSeconds();
	}

	reset_mission() {
	    this.mission_list = null;
	    this.mission_idx = 0;
	    this.houseA = null;
	    this.houseB = null;
	    this.start_house = null;
	    this.end_house = null;
	    this.create_mission();
	    console.log("resat mission");
	}
        
        create() {
            this.game.stage.backgroundColor = 0x333333;
            var cars = [];
	    
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.setImpactEvents(true);
	    this.HOUSE_MATERIAL = this.game.physics.p2.createMaterial();
	    this.CABLE_MATERIAL = this.game.physics.p2.createMaterial();
	    var slippery = this.game.physics.p2.createContactMaterial(this.HOUSE_MATERIAL, this.CABLE_MATERIAL, {friction : 0});
	    this.game.physics.p2.addContactMaterial(slippery);

	    this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);

            
            var playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.playerCollisionGroup = playerCollisionGroup;
            this.cableCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.houseCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.game.physics.p2.updateBoundsCollisionGroup();
            
            //this.game.add.sprite(100, 100, "car");
            this.game.add.tileSprite(0, 0, this.game.width, this.game.height, "asphalt");
            
            this.houseGroup = this.game.add.group();
            var houseGroup = this.houseGroup;
            houseGroup.enableBody = true;
            houseGroup.physicsBodyType = Phaser.Physics.P2JS;
            this.game.physics.p2.friction = 100;
            
            this.collideSound = this.game.add.sound("collide");
	    this.dingSound = this.game.add.sound("ding");
            this.motorSound = this.game.add.sound("motorsound");            
            this.powerupSound = this.game.add.sound("powerup");
            
            this.nextMotorPlay = game.time.time;
            this.nextPuff = game.time.time;

            for (var y = 60; y <= game.height; y += this.HOUSE_SPACE*2) {
                var lastWasCrossing = false;
                
                for (var x = 24; x <= game.width; x += this.HOUSE_SPACE) {
                    var row = (y - 50) / this.HOUSE_SPACE;
                    var col = (x - 30) / this.HOUSE_SPACE;
                    
                    if ((row % 2 == 1 && col % 2 == 1)) {
                        continue;
                    } else if ((row % 2 == 1 || col % 2 == 1) && Math.random() < 0.5) {
                        continue;
                    }
                    
                    if (Math.random() < 0.5) {
                        if (Math.random() < 0.1 || lastWasCrossing) {
                            var parkGfx = Math.random() > 0.75 ? "park1" : "park2";
                            var park:Phaser.Sprite = game.add.sprite(x, y, parkGfx);
                            park.anchor.setTo(0.5, 0.5);
                            lastWasCrossing = false;
                        } else {
                            lastWasCrossing = true;
                        }
                        
                    } else {
                        var houseGfx = Math.random() > 0.25 ? "house1" : "house2";
                        var sprite =  new House(this, x, y, houseGfx);
			this.houseGroup.add(sprite);
                        var spriteBody:Phaser.Physics.P2.Body = sprite.body;
			
                        var gardenTag = Math.random() > 0.5 ? "garden1" : "garden2";
                        if (Math.random() > 0.5) {
                            gardenTag = "garden3";
                        }
                        var garden = this.game.add.sprite(x, y + sprite.height, gardenTag);
                        garden.anchor.set(0.5, 1);
                        
                        spriteBody.setRectangle(this.HOUSE_SIZE, this.HOUSE_SIZE);
                        spriteBody.setCollisionGroup(this.houseCollisionGroup);                    
                        spriteBody.collides([this.houseCollisionGroup, playerCollisionGroup, this.cableCollisionGroup]);
                        spriteBody.mass = 5;

                        spriteBody.setMaterial(this.HOUSE_MATERIAL);
                        spriteBody.fixedRotation = true;
                        
                        var spriteLock = this.game.add.sprite(x, y);
                        this.game.physics.p2.enableBody(spriteLock, false);
                        
                        var spriteLockBody: Phaser.Physics.P2.Body = spriteLock.body;                        
                        spriteLock.body.dynamic = false;
			
                        this.game.physics.p2.createSpring(sprite, spriteLock, 0.01, 1000, 0.9);
                    }
                }                
            }
            
            this.emitter = this.game.add.emitter(0, 0, 100);            
            this.emitter.makeParticles("smoke");
            this.emitter.gravity = 0;
            this.emitter.setScale(0.3, 2, 0.3, 2, 1000, Phaser.Easing.Cubic.InOut, false);  
            this.emitter.setAlpha(0.25, 0, 2000);
            this.emitter.setXSpeed(-25, 25);
            this.emitter.setYSpeed(-25, 25);

            this.badCar = new BadCar(this, -20, 56 * 2 + 16 + this.HOUSE_SPACE * 2 * Math.floor(Math.random() * 5));
            this.badCar.kill();
            
            //this.badCar.body.applyForce([-5, 0], this.badCar.x, this.badCar.y);
            
            this.player = new Player(this, 320, 320);
            
            var body:Phaser.Physics.P2.Body = this.player.body;
            body.setCollisionGroup(playerCollisionGroup);
            body.collides(this.houseCollisionGroup, this.carHitHouse, this);

            /*
              this.emitter = this.game.add.emitter(0, 0, 100);            
              this.emitter.makeParticles("particle");
              this.emitter.gravity = 200;
              this.emitter.setScale(1, 4, 1, 4, 1000, Phaser.Easing.Cubic.InOut, false);             
              this.game.input.onDown.add(this.burst, this);
            */
            
            //GUI Stuff
            var cableIcon: Phaser.Sprite = game.add.sprite(0, 0, "cableUsedIcon");
            cableIcon.scale.setTo(2, 2);
            cableIcon.smoothed = false;
            this.cableUsedText = createText(32, -2, "#FFFFFF", 28, String(this.player.maxCable - this.player.cableUsed * this.player.SEGMENT_LENGTH) + "m");
            this.cableUsedText.setShadow(-5, -5, 'rgba(0,0,0,0.5)', 5);
            this.cableUsedText.stroke = '#000000';
            this.cableUsedText.strokeThickness = 3;
            
            this.activeEffectsIcon = game.add.sprite(20, this.game.height - 40, "powerup1");
            this.activeEffectsIcon.alpha = 1;
            this.activeEffectsText = createText(22, this.game.height - 36, "#FFFFFF", 14, "TEST");
            this.activeEffectsText.stroke = "#000000";
            this.activeEffectsText.strokeThickness = 1;

	    this.reset_mission();
        }
        
        /*
          burst(pointer) {
          this.emitter.x = pointer.x;
          this.emitter.y = pointer.y;
          this.emitter.start(true, 2000, null, 10);
          }*/
        
        carHitHouse(body1, body2) {
            this.collideSound.play();
            //console.log("Hit");
            //body2.sprite.alpha = 0.25;
            //game.add.tween(body2.sprite).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
	    // Shake the camera by moving it up and down 5 times really fast
            this.game.camera.y = 0;
            this.game.add.tween(this.game.camera)
		.to({ y: -5 }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
		.start();
            
            this.emitter.x = body2.x;
            this.emitter.y = body2.y + body2.sprite.height * 0.25;
            this.emitter.start(true, 1000, null, 5);

        }
        
        update() {
	    var dt = this.game.time.totalElapsedSeconds() - this.player.missionStartTime;
	    if (dt > this.mission_time) {
		this.game.state.start("end");
	    }
	    if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
		this.game.state.start("end");
	    }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                if (this.game.time.time > this.nextMotorPlay) {
                    this.nextMotorPlay = this.game.time.time + 700;
                    this.motorSound.play();                    
                }
                
                if (this.game.time.time > this.nextPuff) {
                    this.emitter.x = this.player.x + Math.cos(this.player.rotation) * -this.player.SIZE.x / 2.0 + Math.random() * 6 - 3;
                    this.emitter.y = this.player.y + Math.sin(this.player.rotation) * -this.player.SIZE.y / 2.0 + Math.random() * 6 - 3;
                    this.emitter.start(true, 1000, null, 10);                    
                    this.nextPuff = this.game.time.time + 100;
                }
            }
            
            //Update the GUI in the werst possible manner
            this.cableUsedText.text = String(this.player.maxCable - this.player.cableUsed * this.player.SEGMENT_LENGTH) + "m" + "   " + Math.floor(this.mission_time- dt) + " seconds left " + "Scored " + this.player.score + " points";
            
            this.activeEffectsText.text = "";
            var shouldDisplayEffectIcon: boolean = false;
            for(var i = 1; i<=PowerUp.NUMBER_OF_POWERUPS; i++)
            {
                if(this.player.powerUpTakenTime[i] != 0)
                {
                    shouldDisplayEffectIcon = true;
                    var temp: string = "";
                    switch(i)
                    {
                    case 1:
                        temp += "FASTER ";
                        break;
                    }
                    this.activeEffectsText.text += temp;
                }
            }
            this.activeEffectsIcon.alpha = Number(shouldDisplayEffectIcon);
            
	    // check the cable end
	    if (this.start_house) {
		if (this.end_house.house_hitbox(this.player)) {
		    this.end_mission();
		}
	    }
            
            if(Math.random() * 100 <= (this.game.time.totalElapsedSeconds() - this.lastPowerUpSpawn) / (3.14 * 2))
            {
                var newPowerUp: PowerUp = new PowerUp(this, Math.random() * (this.game.width - 8) + 8, Math.round(Math.random() * 6) * 115 + Math.random() * 16 , Math.round(Math.random()) + 1);
                this.lastPowerUpSpawn = this.game.time.totalElapsedSeconds();
            }
        }
    }
    function createText(x: number, y: number, color: Phaser.Color, size: number, text: string)  {
        var style = { font: "65px Arial", fill: "#000000", align: "center" };
        var _text = game.add.text(x, y, text, style);
        _text.fontSize = size;
        _text.fill = color;
        return _text;
    }

}
