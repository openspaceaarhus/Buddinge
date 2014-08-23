/// <reference path="../lib/phaser.d.ts" />
/// <reference path="BootState.ts" />
/// <reference path="PreloadState.ts" />
/// <reference path="TitleState.ts" />
/// <reference path="PlayState.ts" />

class Game extends Phaser.Game {
    
    constructor() {
        super(800, 600, Phaser.AUTO, "phaser-example", null);
        this.state.add("boot", new states.BootState());
        this.state.add("preload", new states.PreloadState());
        // this.state.add("title", new states.TitleState());
        this.state.add("play", new states.PlayState());
        
        this.state.start("boot");
    }
    
}

var game = new Game();
