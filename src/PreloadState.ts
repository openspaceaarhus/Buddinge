/// <reference path="../lib/phaser.d.ts" />
module states {
    
    export class PreloadState extends Phaser.State {
        preloadBar: Phaser.Sprite;
        
        preload() {
            this.preloadBar = this.add.sprite(200, 250, "preloadbar");
            this.load.setPreloadSprite(this.preloadBar);
            
            this.load.image("titlepage", "assets/titlepage.jpg");
            this.load.image("cable", "assets/particle.png");
            this.load.image("plug", "assets/plug.png");
            this.load.image("car1", "OSAA_LOGO.png");
            this.load.image("level1", "assets/level1.png");
	    this.load.image("connected", "assets/connected.png");
            this.load.audio("zap", "assets/zap.wav");
	    this.game.load.image("asphalt", "assets/asphalt.png");
            this.game.load.image("crossing", "assets/crossing.png");
            
            this.game.load.image("house1", "assets/house1.png");            
            this.game.load.image("house2", "assets/house2.png");            

            this.game.load.image("garden1", "assets/garden1.png");
            this.game.load.image("garden2", "assets/garden2.png");
            this.game.load.image("garden3", "assets/garden3.png");

            this.game.load.image("park1", "assets/park.png");
            this.game.load.image("park2", "assets/park2.png");

            this.game.load.image("car", "assets/car.png");
            this.game.load.image("badcar", "assets/badcar.png");

            this.game.load.image("powerup2", "assets/powerup1.png");
            this.game.load.image("powerup1", "assets/powerup2.png");
            
            this.game.load.image("smoke", "assets/smoke.png");
            this.game.load.image("cableUsedIcon", "assets/cableIcon.png");
            this.game.load.image("asphalt", "assets/asphalt.png");
	    this.game.load.image("hep", "assets/hep.png");
            
            this.game.load.audio("motorsound", "assets/sound/sound_motor.wav");
            this.game.load.audio("ding", "assets/sound/sound_haleding.wav");
            this.game.load.audio("collide", "assets/sound/sound_kollision.wav");
            this.game.load.audio("powerup", "assets/sound/sound_powerup.wav");
            //this.game.load.audio("motorstrained", "assets/sound/sound_motorbelastet.wav");

        }
        
        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startTitleMenu, this);            
        }
        
        startTitleMenu() {
            this.game.state.start("play", true, false);   
        }
        
    }

}
