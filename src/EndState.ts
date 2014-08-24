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
	    console.log("you connected " + (this.ps.mission_idx)/2 );
        }
        
        fadeOut() {
            this.game.state.start("play", true, false);
        }
        
    }

}
