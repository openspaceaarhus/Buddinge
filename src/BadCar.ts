/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>

module states {
    
    export class BadCar extends Phaser.Sprite {
        p2Body: Phaser.Physics.P2.Body;
        
        constructor(ps: PlayState, x: number, y: number) {
            super(ps.game, x, y, "badcar");
            this.anchor.setTo(0.5, 0.5);
            
            this.game.physics.p2.enableBody(this, false);
            var baddieBody:Phaser.Physics.P2.Body = this.body;
            this.p2Body = baddieBody;
            
            baddieBody.setRectangle(this.width, this.height);
            baddieBody.setCollisionGroup(ps.houseCollisionGroup);
            baddieBody.collides([ps.cableCollisionGroup, ps.playerCollisionGroup, ps.houseCollisionGroup]);
            baddieBody.mass = 0.01;
            this.bringToTop();
            
            this.game.add.existing(this);
        }
        
        
    }
    
}