/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts" />
module states {
    
    export class EndState extends Phaser.State {
        
        background: Phaser.Sprite;
        logo: Phaser.Sprite;
	ps : PlayState;
	
	constructor(ps : PlayState) {
	    super();
	    this.ps = ps;
	}
        create() {
            this.background = this.add.sprite(0, 0, "dead");
            this.background.alpha = 0;
            
            this.add.tween(this.background).to({ alpha: 1}, 2000, Phaser.Easing.Elastic.InOut, true);
            this.input.onDown.addOnce(this.fadeOut, this);
	    
            this.createText(20, 100, "#00FF00", 24, "you connected " + (this.ps.player.housesConnected) + " houses");
            this.createText(20, 200, "#00FF00", 24, "You scored: " + (this.ps.player.score));
            this.createText(20, 300, "#00FF00", 24, "You played for: " + Math.floor((this.ps.game.time.totalElapsedSeconds() - this.ps.player.gameStarted)) + " seconds");
	    this.createText(20, 400, "#00FF00", 24, "You laided : " + this.ps.player.cableUsed + " meters of cable");
	    this.createText(20, 500, "#FF0000", 24, "Press to play again");
        }

	update() {
	    // if (this.game.input.keyboard.isDown(Phaser.Keyboard.ANY)) fadeOut();

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
