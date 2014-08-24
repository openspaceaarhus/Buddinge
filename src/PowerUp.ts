/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>
module states
{
    export class PowerUp extends Phaser.Sprite
    {
        TIME_TO_LIVE: number = 5;
        spawnTime: number;
        type: number;
        ps: PlayState;
        onPickupText: Phaser.Text;
        constructor(ps: PlayState, x: number, y: number, type: number)
        {
            super(ps.game, x, y, "PowerUp1");
            this.anchor.setTo(0.5, 0.5);
            
            this.spawnTime = ps.game.time.totalElapsedSeconds();
            this.type = type;
            this.ps = ps;
            ps.game.add.existing(this);
        }
        
        update()
        {
            //Check if the player is touching the PowerUp
            if(this.overlap(this.ps.player))
            {
                //If true then add an effect to the player
                this.ps.player.addEffect(this.type);
                var text: string;
                switch(this.type)
                {
                case 1:
                    text = "Faster car";
                    break;
                }
                this.onPickupText = createText(this.ps.player.x, this.ps.player.y, "#000000", 20, text);
                this.destroy(true);
            }
            if(this.ps.game.time.totalElapsedSeconds() > (this.spawnTime + this.TIME_TO_LIVE))
            {
                this.destroy(true);
            }
            if(this.pu)
            {
            }
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