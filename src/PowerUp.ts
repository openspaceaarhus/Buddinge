/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>
module states
{
    /*export class FadingText extends Phaser.Text
    {
        TIME_TO_LIVE: number = 2;
        timeCreated: number;
        game: Phaser.Game;
        constructor(game: Phaser.Game, x: number, y: number, text: string, color: Phaser.Color, size: number)
        {
            super(game, x, y, text, { align: "center" });
            this.fill = color;
            this.fontSize = size;
            this.game = game;
            
            this.timeCreated = game.time.totalElapsedSeconds();
            this.game.add.existing(this);
        }
        
        update()
        {
            //this.position.y -= 100.0 / 60.0 / this.TIME_TO_LIVE;
            if(this.timeCreated + this.TIME_TO_LIVE < this.game.time.totalElapsedSeconds())
            {
                this.destroy(true);
            }
        }
    }*/
    export class PowerUp extends Phaser.Sprite
    {
        TIME_TO_LIVE: number = 5;
        spawnTime: number;
        type: number;
        ps: PlayState;
        constructor(ps: PlayState, x: number, y: number, type: number)
        {
            super(ps.game, x, y, "powerup" + String(type));
            this.anchor.setTo(0.5, 0.5);
            this.game.physics.p2.enableBody(this, false);
            this.body.setRectangle(16, 16);
            this.body.static = true;
            
            this.spawnTime = ps.game.time.totalElapsedSeconds();
            this.type = type;
            this.ps = ps;
            ps.game.add.existing(this);
            
            ps.game.add.tween(this).to( { alpha: 0.5 }, 600, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }
        
        update()
        {
            //Check if the player is touching the PowerUp
            if(this.overlap(this.ps.player))
            {
                //If true then add an effect to the player
                switch(this.type)
                {
                case 2:
                    this.ps.player.maxCable += 50;
                    break;
                default:
                    this.ps.player.addEffect(this.type);
                    break;
                }
                /*var text: string;
                switch(this.type)
                {
                case 1:
                    text = "Faster car";
                    break;
                }
                var onPickupText: FadingText = new FadingText(this.ps.game, this.ps.player.x, this.ps.player.y, text, "#000000", 20);*/
                this.destroy(true);
            }
            if(this.ps.game.time.totalElapsedSeconds() > (this.spawnTime + this.TIME_TO_LIVE))
            {
                this.destroy(true);
            }
        }
        remove()
        {
            console.log(".");
            this.destroy(true);
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