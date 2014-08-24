/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>

module states {
    
    export class BadCar extends Phaser.Sprite {
        p2Body: Phaser.Physics.P2.Body;
        ps: PlayState;
        nextPushTime: number;
        dir: number;
        
        constructor(ps: PlayState, x: number, y: number) {
            super(ps.game, x, y, "badcar");
            this.ps = ps;
            
            this.anchor.setTo(0.5, 0.5);
            
            this.game.physics.p2.enableBody(this, false);
            var baddieBody:Phaser.Physics.P2.Body = this.body;
            this.p2Body = baddieBody;
            
            baddieBody.setRectangle(this.width, this.height);
            baddieBody.setCollisionGroup(ps.houseCollisionGroup);
            baddieBody.collides([ps.cableCollisionGroup, ps.playerCollisionGroup, ps.houseCollisionGroup]);
            baddieBody.mass = 3;            
            baddieBody.collideWorldBounds = false;
            
            this.checkWorldBounds = true;
            
            this.events.onOutOfBounds.add(function(obj) {
                obj.kill();
            }, this);
            
            this.bringToTop();
            
            this.game.add.existing(this);
            this.dir = 1;
            this.nextPushTime = this.game.time.time + 1000;
            
            this.events.onKilled.add(function(obj: BadCar) {
                obj.game.time.events.add(Phaser.Timer.SECOND * 10 + 10000 * Math.random(), obj.respawn, obj);                
            }, this);
        }
        
        update() {
            if (this.nextPushTime > this.game.time.time) {
                this.nextPushTime = this.game.time.time + 1000;
                this.body.applyForce([-20 * this.dir, 0], this.x, this.y);
                this.limitSpeedP2JS();
            }
        }
        
        respawn() {            
                this.revive(1);
                
                this.dir = Math.random() > 0.5 ? 1 : -1;
                var startX = (this.dir >= 0) ? -20 : this.ps.game.width + 20;
                
                this.reset(startX, 56 * 2 + 16 + this.ps.HOUSE_SPACE * 2 * Math.floor(Math.random() * 5));
                this.p2Body.velocity.x = 200 * this.dir;
                this.game.add.existing(this);
                
                if (this.dir < 0){
                    this.scale.x = -1;
                } else {
                    this.scale.x = 1;
                }
        }
        
        limitSpeedP2JS() {
            var maxSpeed = 200;
            
            var x = this.p2Body.velocity.x;
            var y = this.p2Body.velocity.y;

            if (Math.pow(x, 2) + Math.pow(y, 2) > Math.pow(maxSpeed, 2)) {

                var a = Math.atan2(y, x);
                x = -20 * Math.cos(a) * maxSpeed;
                y = -20 * Math.sin(a) * maxSpeed;
                this.p2Body.velocity.x = x;
                this.p2Body.velocity.y = y;
            }
        }
        
    }
}