/// <reference path="../lib/phaser.d.ts" />
module states {
    export class Player extends Phaser.Sprite {
        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, "car1", 0);
            this.anchor.setTo(0.5, 0.5);
            this.animations.add("walk", [0, 1, 2, 3, 4], 10, true);
            game.physics.arcade.enableBody(this);
            game.add.existing(this);
        }
        
        update() 
        {
            this.animations.frame = 0;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.angularVelocity = 0;
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) 
            {
                this.body.angularVelocity = -200;
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) 
            {
                this.body.angularVelocity = 200;
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
            {
                this.body.velocity.x = Math.cos(this.rotation) * 50;
                this.body.velocity.y = Math.sin(this.rotation) * 50;
            }
        }
    }
}