/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts" />
module states {
    
    export class EndState extends Phaser.State {
        
        background: Phaser.Sprite;
        logo: Phaser.Sprite;
	ps : PlayState;
	emitter: Phaser.Particles.Arcade.Emitter;
	
	constructor(ps : PlayState) {
	    super();
	    this.ps = ps;
	}
        create() {
            this.input.onDown.addOnce(this.fadeOut, this);

	    
	    this.emitter = this.ps.game.add.emitter(this.ps.game.width/2, 50, 1000);            
            this.emitter.makeParticles("car");
            this.emitter.gravity = 50;
            //this. emitter.setScale(0.3, 2, 0.3, 2, 1000, Phaser.Easing.Cubic.InOut, false);  
            this.emitter.setAlpha(0.25, 1.0, 2000);
            this.emitter.setXSpeed(-25, 25);
            this.emitter.setYSpeed(-25, 25);
	    this.emitter.start(false, 100000, null, 100);


            this.createText(20, 100, "#00FF00", 24, "Connected:  " + (this.ps.player.housesConnected) + " houses");
            this.createText(20, 200, "#00FF00", 24, "Scored:     " + (this.ps.player.score));
            this.createText(20, 300, "#00FF00", 24, "Played for: " + Math.floor((this.ps.game.time.totalElapsedSeconds() - this.ps.player.gameStarted)) + " seconds");
	    this.createText(20, 400, "#00FF00", 24, "Cable used: " + this.ps.player.cableUsed + " meters of cable");
	    this.createText(20, 500, "#FF0000", 24, "Press to play again");
        }

	update() {
	    // if (this.game.input.keyboard.isDown(Phaser.Keyboard.ANY)) fadeOut();
	    this.emitter.x  = (this.emitter.x + 13) % this.ps.game.width;
	}

	createText(x: number, y: number, color: Phaser.Color, size: number, text: string)  {
	    // I AM COPY PASTE FROM PLAYERSTATE
            var style = { font: "65px Arial", fill: "#000000", align: "center" };
            var _text = game.add.text(x, y, text, style);
            _text.fontSize = size;
            _text.fill = color;
            return _text;
	}


	
        fadeOut() {
            this.game.state.start("play", true, false);
        }
        
    }

}
