/// <reference path="../lib/phaser.d.ts" />
/// <reference path="Player.ts"/>
module states {

    
    export class PlayState extends Phaser.State {    
        
        HOUSE_SIZE: number = 64;
        HOUSE_SPACE: number = 76;

	HOUSE_MATERIAL : Phaser.Physics.P2.Material;
	CABLE_MATERIAL : Phaser.Physics.P2.Material;

        emitter: Phaser.Particles.Arcade.Emitter;
        player: Player;   
        
        houseGroup: Phaser.Group;
        houseCollisionGroup: Phaser.Physics.P2.CollisionGroup;
        cableCollisionGroup: Phaser.Physics.P2.CollisionGroup;
        
        collideSound: Phaser.Sound;
        motorSound: Phaser.Sound;
        
        nextMotorPlay: number;
        nextPuff: number;
        
        cableUsedText: Phaser.Text;
        
        preload() {
            this.game.load.image("house1", "assets/house1.png");            
            this.game.load.image("car", "assets/car.png");
            this.game.load.image("park", "assets/park.png");
            this.game.load.image("smoke", "assets/smoke.png");
            this.game.load.image("cableUsedIcon", "assets/cableIcon.png");
            
            //this.game.load.audio("ding", "assets/sound/sound_haleding.wav");
            this.game.load.audio("collide", "assets/sound/sound_kollision.wav");
            this.game.load.audio("motorsound", "assets/sound/sound_motor.wav", true);
            //this.game.load.audio("motorstrained", "assets/sound/sound_motorbelastet.wav");
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
            this.cableCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.houseCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.game.physics.p2.updateBoundsCollisionGroup();
                                
            //this.game.add.sprite(100, 100, "car");
            
            this.houseGroup = this.game.add.group();
            var houseGroup = this.houseGroup;
            houseGroup.enableBody = true;
            houseGroup.physicsBodyType = Phaser.Physics.P2JS;
            this.game.physics.p2.friction = 100;
            
            this.collideSound = this.game.add.sound("collide");
            this.motorSound = this.game.add.sound("motorsound");            
            this.nextMotorPlay = game.time.time;
            this.nextPuff = game.time.time;
                    
            for (var y = 50; y < game.height; y += this.HOUSE_SPACE) {
                for (var x = 50; x < game.width; x += this.HOUSE_SPACE) {
                    var row = (y - 50) / this.HOUSE_SPACE;
                    var col = (x - 50) / this.HOUSE_SPACE;
                    
                    if ((row % 2 == 1 && col % 2 == 1)) {
                        continue;
                    } else if ((row % 2 == 1 || col % 2 == 1) && Math.random() < 0.5) {
                        continue;
                    }
                    
                    if (Math.random() < 0.35) {
                        var park:Phaser.Sprite = game.add.sprite(x, y, "park");
                        park.anchor.setTo(0.5, 0.5);
                        
                        
                    } else {
                        var sprite = houseGroup.create(x, y, "house1");
                        var spriteBody:Phaser.Physics.P2.Body = sprite.body;
                    
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
//                        this.game.physics.p2.createLockConstraint(spriteBody, spriteLockBody);
                    }
                }
            }
                        
            this.emitter = this.game.add.emitter(0, 0, 100);            
            this.emitter.makeParticles("smoke");
            this.emitter.gravity = 0;
            this.emitter.setScale(0.1, 1, 0.1, 1, 1000, Phaser.Easing.Cubic.InOut, false);  
            this.emitter.setAlpha(0.25, 0, 2000);
            this.emitter.setXSpeed(-25, 25);
            this.emitter.setYSpeed(-25, 25);

	       this.player = new Player(this, 300, 300);
            
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
            this.cableUsedText = createText(32, -2, "#FFFFFF", 28, String(200 - this.player.cableUsed * this.player.SEGMENT_LENGTH) + "m");
            this.cableUsedText.setShadow(-5, -5, 'rgba(0,0,0,0.5)', 5);
            this.cableUsedText.stroke = '#000000';
            this.cableUsedText.strokeThickness = 3;
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
        }
        
        update() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                if (this.game.time.time > this.nextMotorPlay) {
                    this.nextMotorPlay = this.game.time.time + 700;
                    this.motorSound.play();                    
                }
                
                if (this.game.time.time > this.nextPuff) {
                    this.emitter.x = this.player.x + Math.cos(this.player.rotation) * -this.player.SIZE.x / 2.0 + Math.random() * 10 - 5;
                    this.emitter.y = this.player.y + Math.sin(this.player.rotation) * -this.player.SIZE.y / 2.0 + Math.random() * 10 - 5;
                    this.emitter.start(true, 1000, null, 10);                    
                    this.nextPuff = this.game.time.time + 100;
                }
            } else {
                this.motorSound.stop();
            }

            //Update the GUI
            this.cableUsedText.text = String(200 - this.player.cableUsed * this.player.SEGMENT_LENGTH) + "m";
        }
    }
    function createText(x: number, y: number, color: Phaser.Color, size: number, text: string)
    {
        var style = { font: "65px Arial", fill: "#000000", align: "center" };
        var _text = game.add.text(x, y, text, style);
        _text.fontSize = size;
        _text.fill = color;
        return _text;
    }
}
