/// <reference path="../lib/phaser.d.ts" />
/// <reference path="Player.ts"/>
module states {
    
    export class PlayState extends Phaser.State {
        HOUSE_SIZE: number = 64;
        HOUSE_SPACE: number = 150;

        emitter: Phaser.Particles.Arcade.Emitter;
        player: Player;   
        houseGroup: Phaser.Group;
        
        
        preload() {
            this.game.load.image("house1", "assets/house1.png");            
            this.game.load.image("car", "assets/car.png");
            this.game.load.image("park", "assets/park.png");
        }
        
        create() {
            this.game.stage.backgroundColor = 0x333333;
            
            var cars = [];

            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.setImpactEvents(true);
            
            var playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
            var houseCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.game.physics.p2.updateBoundsCollisionGroup();
                                
            //this.game.add.sprite(100, 100, "car");
            
            this.houseGroup = this.game.add.group();
            var houseGroup = this.houseGroup;
            houseGroup.enableBody = true;
            houseGroup.physicsBodyType = Phaser.Physics.P2JS;
            this.game.physics.p2.friction = 100;
            
                    
            for (var y = 50; y < game.height; y += this.HOUSE_SPACE) {
                for (var x = 50; x < game.width; x += this.HOUSE_SPACE) {
                    if (Math.random() < 0.25) {
                        var sprite = houseGroup.create(x, y, "park");
                    } else {
                        var sprite = houseGroup.create(x, y, "house1");
                        var spriteBody:Phaser.Physics.P2.Body = sprite.body;
                    
                        spriteBody.setRectangle(this.HOUSE_SIZE, this.HOUSE_SIZE);
                        spriteBody.setCollisionGroup(houseCollisionGroup);                    
                        spriteBody.collides([houseCollisionGroup, playerCollisionGroup]);
                        spriteBody.mass = 5;
                    
                        var spriteLock = this.game.add.sprite(x, y);
                        this.game.physics.p2.enableBody(spriteLock, false);
                        spriteLock.body.dynamic = false;
                    
                        this.game.physics.p2.createSpring(sprite, spriteLock, 0.01, 1000, 0.9);
                    }
                }
            }
            
            this.player = new Player(this.game, 100, 100);
            
            var body:Phaser.Physics.P2.Body = this.player.body;
            body.setCollisionGroup(playerCollisionGroup);
            body.collides(houseCollisionGroup, this.carHitHouse, this);

            /*
            this.emitter = this.game.add.emitter(0, 0, 100);            
            this.emitter.makeParticles("particle");
            this.emitter.gravity = 200;
            this.emitter.setScale(1, 4, 1, 4, 1000, Phaser.Easing.Cubic.InOut, false);             
            this.game.input.onDown.add(this.burst, this);
            */
        }
        
        /*
        burst(pointer) {
            this.emitter.x = pointer.x;
            this.emitter.y = pointer.y;
            this.emitter.start(true, 2000, null, 10);
        }
        */
             
        carHitHouse(body1, body2) {
            //console.log("Hit");
            //body2.sprite.alpha = 0.25;
            //game.add.tween(body2.sprite).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
        }
        
        update() {
            this.houseGroup.forEach(function (sprite: Phaser.Sprite) {
                sprite.body.angularVelocity = 0;
                sprite.body.angle = 0;
            }, this);
        }
    }

}
