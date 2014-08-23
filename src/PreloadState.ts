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
            this.load.audio("zap", "assets/zap.wav");
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
