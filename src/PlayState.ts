/// <reference path="../lib/phaser.d.ts" />
/// <reference path="Player.ts"/>
module states {
    
    export class PlayState extends Phaser.State {
        emitter: Phaser.Particles.Arcade.Emitter;
        player: Player;        
        
        preload() {
            this.game.load.image("house1", "assets/house1.png");            
            this.game.load.image("car", "assets/car.png");            
        }
        
        create() {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.stage.backgroundColor = 0x000000;

            //this.game.add.sprite(100, 100, "car");
            
            for (var y = 50; y < game.height; y += 150) {
                for (var x = 50; x < game.width; x += 150) {
                    this.game.add.sprite(x, y, "house1");
                }
            }
            
            this.player = new Player(this.game, 100, 100);
            
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
        
    }

}
