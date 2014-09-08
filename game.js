var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../lib/phaser.d.ts" />
var states;
(function (states) {
    var BootState = (function (_super) {
        __extends(BootState, _super);
        function BootState() {
            _super.apply(this, arguments);
        }
        BootState.prototype.preload = function () {
            this.load.image("preloadbar", "assets/loader.png");
        };

        BootState.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.game.state.start("preload", true, false);
        };
        return BootState;
    })(Phaser.State);
    states.BootState = BootState;
})(states || (states = {}));
/// <reference path="../lib/phaser.d.ts" />
var states;
(function (states) {
    var PreloadState = (function (_super) {
        __extends(PreloadState, _super);
        function PreloadState() {
            _super.apply(this, arguments);
        }
        PreloadState.prototype.preload = function () {
            this.preloadBar = this.add.sprite(200, 250, "preloadbar");
            this.load.setPreloadSprite(this.preloadBar);

            this.load.image("titlepage", "assets/titlepage.jpg");
            this.load.image("cable", "assets/particle.png");
            this.load.image("plug", "assets/plug.png");
            this.load.image("car1", "OSAA_LOGO.png");
            this.load.image("level1", "assets/level1.png");
            this.load.image("connected", "assets/connected.png");
            this.load.audio("zap", "assets/zap.wav");
            this.game.load.image("asphalt", "assets/asphalt.png");
            this.game.load.image("crossing", "assets/crossing.png");

            this.game.load.image("house1", "assets/house1.png");
            this.game.load.image("house2", "assets/house2.png");

            this.game.load.image("garden1", "assets/garden1.png");
            this.game.load.image("garden2", "assets/garden2.png");
            this.game.load.image("garden3", "assets/garden3.png");

            this.game.load.image("park1", "assets/park.png");
            this.game.load.image("park2", "assets/park2.png");

            this.game.load.image("car", "assets/car.png");
            this.game.load.image("badcar", "assets/badcar.png");

            this.game.load.image("powerup2", "assets/powerup1.png");
            this.game.load.image("powerup1", "assets/powerup2.png");

            this.game.load.image("smoke", "assets/smoke.png");
            this.game.load.image("cableUsedIcon", "assets/cableIcon.png");
            this.game.load.image("asphalt", "assets/asphalt.png");
            this.game.load.image("hep", "assets/hep.png");

            this.game.load.audio("motorsound", "assets/sound/sound_motor.wav");

            // this.game.load.audio("ding", "assets/sound/sound_haleding.wav");
            this.game.load.audio("connect", "assets/sound/connect.ogg");
            this.game.load.audio("collide", "assets/sound/sound_kollision.wav");
            this.game.load.audio("powerup", "assets/sound/sound_powerup.wav");

            //this.game.load.audio("motorstrained", "assets/sound/sound_motorbelastet.wav");
            this.game.load.image("dead", "assets/dead.png");
        };

        PreloadState.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startTitleMenu, this);
        };

        PreloadState.prototype.startTitleMenu = function () {
            this.game.state.start("play", true, false);
        };
        return PreloadState;
    })(Phaser.State);
    states.PreloadState = PreloadState;
})(states || (states = {}));
/// <reference path="../lib/phaser.d.ts" />
var states;
(function (states) {
    var TitleState = (function (_super) {
        __extends(TitleState, _super);
        function TitleState() {
            _super.apply(this, arguments);
        }
        TitleState.prototype.create = function () {
            this.background = this.add.sprite(0, 0, "titlepage");
            this.background.alpha = 0;

            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Elastic.InOut, true);

            this.input.onDown.addOnce(this.fadeOut, this);
        };

        TitleState.prototype.fadeOut = function () {
            this.game.state.start("play", true, false);
        };
        return TitleState;
    })(Phaser.State);
    states.TitleState = TitleState;
})(states || (states = {}));
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>
var states;
(function (states) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(ps, x, y) {
            _super.call(this, ps.game, x, y, "car");
            this.MAX_SPEED = 20;
            this.ROTATION_SPEED = 5;
            this.SIZE = new Phaser.Point(24, 15);
            this.cableUsed = 0;
            this.maxCable = 200;
            this.SEGMENT_SIZE = 5;
            this.SEGMENT_LENGTH = 1;
            this.powerUpsEffectTime = {};
            this.powerUpTakenTime = {};
            this.housesConnected = 0;
            this.missionStartTime = 0;
            this.score = 0;
            this.anchor.setTo(0.5, 0.5);
            this.ps = ps;
            this.game.physics.p2.enableBody(this, false);
            var body = this.body;
            body.setRectangle(this.SIZE.x, this.SIZE.y);
            body.mass = 2;
            game.add.existing(this);
            this.cable = null;
            this.gameStarted = game.time.totalElapsedSeconds();

            for (var i = 1; i <= states.PowerUp.NUMBER_OF_POWERUPS; i++) {
                this.powerUpTakenTime[i] = 0;
                this.powerUpsEffectTime[i];
            }
        }
        Player.prototype.update = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.angularVelocity = -this.ROTATION_SPEED;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.angularVelocity = this.ROTATION_SPEED;
            } else {
                this.body.angularVelocity = 0;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.body.damping = 0.0;
                this.body.applyForce([Math.cos(this.rotation) * -this.MAX_SPEED, Math.sin(this.rotation) * -this.MAX_SPEED], this.x + Math.cos(this.rotation) * this.SIZE.x / 2.0, this.y + Math.sin(this.rotation) * this.SIZE.y / 2.0);
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.body.damping = 0.0;
                this.body.applyForce([Math.cos(this.rotation) * this.MAX_SPEED / 2.0, Math.sin(this.rotation) * this.MAX_SPEED / 2.0], this.x + Math.cos(this.rotation) * -this.SIZE.x / 2.0, this.y + Math.sin(this.rotation) * -this.SIZE.y / 2.0);
            } else {
                this.body.damping = 0.7;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                if (!this.cable) {
                    // check if this is a valid place to start a connection?
                    var start = this.ps.can_start_cable(this);
                    if (start && (this.cableUsed < this.maxCable)) {
                        this.add_cable(1);
                        this.ps.set_start_house(start);
                    }
                } else {
                    this.add_segment();
                }
            }

            for (var i = 1; i <= states.PowerUp.NUMBER_OF_POWERUPS; i++) {
                if (this.powerUpTakenTime[i] + this.powerUpsEffectTime[i] < this.ps.game.time.totalElapsedSeconds()) {
                    switch (i) {
                        case 1:
                            this.MAX_SPEED = 20;
                            break;
                    }
                    this.powerUpsEffectTime[i] = 0;
                    this.powerUpTakenTime[i] = 0;
                }
            }
        };

        Player.prototype.add_segment = function () {
            if (this.cableUsed >= this.maxCable) {
                return;
            }
            this.cableUsed++;
            var p2 = this.game.physics.p2;

            // remove last constrain between this.last_segment and car
            if (this.last_constraint)
                p2.removeConstraint(this.last_constraint);

            // create a new segment Sprite
            var x = this.body.x + Math.cos(this.rotation + 3.14) * this.SEGMENT_SIZE;
            var y = this.body.y + Math.sin(this.rotation + 3.14) * this.SEGMENT_SIZE;

            var l = this.cable.create(x, y, 'cable');
            var body = l.body;
            body.setRectangle(this.SEGMENT_SIZE, this.SEGMENT_SIZE);
            body.mass = .02;
            body.damping = .7;
            body.setMaterial(this.ps.CABLE_MATERIAL);
            body.setCollisionGroup(this.ps.cableCollisionGroup);
            body.collides(this.ps.houseCollisionGroup);

            // add constrain between new segment and car + last segment and new segment
            if (this != this.last_segment) {
                var constraint = this.game.physics.p2.createDistanceConstraint(l, this.last_segment, this.SEGMENT_SIZE, 1000);
            } else {
                // it must be acnhored to ze ground because it is the first segment
                body.static = true;
            }
            this.last_constraint = this.game.physics.p2.createDistanceConstraint(l, this, this.SEGMENT_SIZE, 1000);

            // update last constrain and last segment
            this.last_segment = l;
            this.bringToTop();
        };

        Player.prototype.remove_cable = function () {
            if (!this.cable)
                return;

            // remove last constrain between this.last_segment and car
            if (this.last_constraint)
                this.game.physics.p2.removeConstraint(this.last_constraint);

            this.cable.destroy(true);
            this.last_segment = null;
            this.last_constraint = null;
            this.cable = null;
            this.game.physics.p2.getConstraints().forEach(function (c) {
                this.game.physics.p2.removeConstraint(c);
            });
        };

        Player.prototype.add_cable = function (N) {
            this.cable = this.game.add.group();
            this.cable.enableBody = true;
            this.cable.physicsBodyType = Phaser.Physics.P2JS;

            this.last_segment = this;
            this.last_constraint = null;

            for (var i = 0; i < N; i++) {
                this.add_segment();
            }
        };
        Player.prototype.addEffect = function (type) {
            //Add the effect
            if (this.powerUpTakenTime[type] == 0) {
                this.powerUpTakenTime[type] = this.ps.game.time.totalElapsedSeconds();
                this.powerUpsEffectTime[type] = 20;
                switch (type) {
                    case 1:
                        this.MAX_SPEED = 30;
                        break;
                }
            } else if (this.powerUpTakenTime[type] > 0) {
                this.powerUpsEffectTime[type] += 20;
            }
        };
        return Player;
    })(Phaser.Sprite);
    states.Player = Player;
})(states || (states = {}));
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>
var states;
(function (states) {
    var House = (function (_super) {
        __extends(House, _super);
        function House(ps, x, y, housegfx) {
            _super.call(this, ps.game, x, y, housegfx);
            this.is_connected = false;
            this.ps = ps;
            this.game.physics.p2.enableBody(this, false);
            var body = this.body;
            game.add.existing(this);
        }
        House.prototype.update = function () {
        };

        House.prototype.remove_emitter = function () {
            if (this.emitter)
                this.emitter.destroy();
        };

        House.prototype.celebrate = function () {
            this.emitter = this.game.add.emitter(this.x, this.y, 1000);
            this.emitter.makeParticles("connected");
            this.emitter.gravity = 200;
            this.emitter.start(true, 5000, null, 50);

            this.emitter.setScale(0.3, 2, 0.3, 2, 1000, Phaser.Easing.Cubic.InOut, false);
            this.emitter.setAlpha(1, 0, 2000);

            this.is_connected = true;
            this.high_light.destroy();
            this.high_light = this.game.add.sprite(this.x, this.y + 24, "connected");
            this.high_light.anchor.setTo(.5, .5);
        };

        House.prototype.hilight_house = function () {
            this.high_light = this.game.add.sprite(this.x, this.y + 24, "hep");
            this.high_light.anchor.setTo(.5, .5);
        };

        House.prototype.house_hitbox = function (p) {
            var dy = (p.y - this.y);
            var dx = (p.x - this.x);
            return Math.abs(dx) < 24 && dy > 24 && dy < 48;
        };
        return House;
    })(Phaser.Sprite);
    states.House = House;
})(states || (states = {}));
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>
var states;
(function (states) {
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
    var PowerUp = (function (_super) {
        __extends(PowerUp, _super);
        function PowerUp(ps, x, y, type) {
            _super.call(this, ps.game, x, y, "powerup" + String(type));
            this.TIME_TO_LIVE = 20;
            this.anchor.setTo(0.5, 0.5);
            this.game.physics.p2.enableBody(this, false);
            this.body.setRectangle(16, 16);
            this.body.static = true;

            this.spawnTime = ps.game.time.totalElapsedSeconds();
            this.type = type;
            this.ps = ps;
            ps.game.add.existing(this);

            ps.game.add.tween(this).to({ alpha: 0.5 }, 600, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }
        PowerUp.prototype.update = function () {
            //Check if the player is touching the PowerUp
            if (this.overlap(this.ps.player)) {
                switch (this.type) {
                    case 2:
                        this.ps.player.maxCable += 50;
                        break;
                    default:
                        this.ps.player.addEffect(this.type);
                        break;
                }

                this.ps.powerupSound.play();

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
            if (this.ps.game.time.totalElapsedSeconds() > (this.spawnTime + this.TIME_TO_LIVE)) {
                this.destroy(true);
            }
        };
        PowerUp.prototype.remove = function () {
            console.log(".");
            this.destroy(true);
        };
        PowerUp.NUMBER_OF_POWERUPS = 2;
        return PowerUp;
    })(Phaser.Sprite);
    states.PowerUp = PowerUp;
    function createText(x, y, color, size, text) {
        var style = { font: "65px Arial", fill: "#000000", align: "center" };
        var _text = game.add.text(x, y, text, style);
        _text.fontSize = size;
        _text.fill = color;
        return _text;
    }
})(states || (states = {}));
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts"/>
var states;
(function (states) {
    var BadCar = (function (_super) {
        __extends(BadCar, _super);
        function BadCar(ps, x, y) {
            _super.call(this, ps.game, x, y, "badcar");
            this.ps = ps;

            this.anchor.setTo(0.5, 0.5);

            this.game.physics.p2.enableBody(this, false);
            var baddieBody = this.body;
            this.p2Body = baddieBody;

            baddieBody.setRectangle(this.width, this.height);
            baddieBody.setCollisionGroup(ps.houseCollisionGroup);
            baddieBody.collides([ps.cableCollisionGroup, ps.playerCollisionGroup, ps.houseCollisionGroup]);
            baddieBody.mass = 3;
            baddieBody.collideWorldBounds = false;

            this.checkWorldBounds = true;

            this.events.onOutOfBounds.add(function (obj) {
                obj.kill();
            }, this);

            this.bringToTop();

            this.game.add.existing(this);
            this.dir = 1;
            this.nextPushTime = this.game.time.time + 1000;

            this.events.onKilled.add(function (obj) {
                obj.game.time.events.add(Phaser.Timer.SECOND * 10 + 10000 * Math.random(), obj.respawn, obj);
            }, this);
        }
        BadCar.prototype.update = function () {
            if (this.nextPushTime > this.game.time.time) {
                this.nextPushTime = this.game.time.time + 1000;
                this.body.applyForce([-20 * this.dir, 0], this.x, this.y);
                this.limitSpeedP2JS();
            }
        };

        BadCar.prototype.respawn = function () {
            this.revive(1);

            this.dir = Math.random() > 0.5 ? 1 : -1;
            var startX = (this.dir >= 0) ? -20 : this.ps.game.width + 20;

            this.reset(startX, 56 * 2 + 16 + this.ps.HOUSE_SPACE * 2 * Math.floor(Math.random() * 5));
            this.p2Body.velocity.x = 200 * this.dir;
            this.game.add.existing(this);

            if (this.dir < 0) {
                this.scale.x = -1;
            } else {
                this.scale.x = 1;
            }
        };

        BadCar.prototype.limitSpeedP2JS = function () {
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
        };
        return BadCar;
    })(Phaser.Sprite);
    states.BadCar = BadCar;
})(states || (states = {}));
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="Player.ts"/>
/// <reference path="House.ts"/>
/// <reference path="PowerUp.ts"/>
/// <reference path="BadCar.ts"/>
var states;
(function (states) {
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            _super.apply(this, arguments);
            this.HOUSE_SIZE = 48;
            this.HOUSE_SPACE = 56;
            this.lastPowerUpSpawn = 0;
            this.end_house = null;
            this.mission_time = 30;
            this.mission_list = null;
            this.mission_idx = 0;
        }
        PlayState.prototype.get_permuted_house = function (idx) {
            return this.houseGroup.getAt(this.mission_list[idx]);
        };

        PlayState.prototype.can_start_cable = function (p) {
            var houseA = this.get_permuted_house(this.mission_idx);
            var houseB = this.get_permuted_house(this.mission_idx + 1);
            if (houseB || houseA) {
                if (houseA.house_hitbox(p)) {
                    return houseA;
                } else if (houseB.house_hitbox(p)) {
                    return houseB;
                }
            }
            return null;
        };

        PlayState.prototype.set_start_house = function (house) {
            // we just need to know where to end ie attach to start house, must go to end_house
            if (this.get_permuted_house(this.mission_idx) == house)
                this.end_house = this.get_permuted_house(this.mission_idx + 1);
            else
                this.end_house = this.get_permuted_house(this.mission_idx);
        };

        PlayState.prototype.end_mission = function () {
            this.connectSound.play();

            if (this.mission_idx > 0) {
                this.get_permuted_house(this.mission_idx - 2).remove_emitter();
                this.get_permuted_house(this.mission_idx - 1).remove_emitter();
            }
            this.get_permuted_house(this.mission_idx).celebrate();
            this.get_permuted_house(this.mission_idx + 1).celebrate();
            this.mission_idx += 2;

            // make ready for next mission
            this.player.remove_cable();

            this.player.housesConnected += 2;
            var dt = this.game.time.totalElapsedSeconds() - this.player.missionStartTime;
            this.player.score += Math.floor(this.mission_time - dt);
            if (dt < this.mission_time * .1)
                this.player.score + 20;

            // create next mission
            this.create_mission();
        };

        PlayState.prototype.shuffle = function (array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        };

        PlayState.prototype.create_mission = function () {
            // console.log("create mission " + this.mission_idx);
            var mission_list = this.mission_list;
            if (!mission_list) {
                mission_list = new Array();
                for (var i = 0; i < this.houseGroup.countLiving(); i++) {
                    mission_list[mission_list.length] = i;
                }
                this.mission_list = this.shuffle(mission_list);
            }

            if (this.mission_idx + 2 > mission_list.length) {
                // console.log("no more missions on this level");
                this.game.state.start("end");
                return;
            }
            this.get_permuted_house(this.mission_idx + 0).hilight_house();
            this.get_permuted_house(this.mission_idx + 1).hilight_house();
            this.player.missionStartTime = this.game.time.totalElapsedSeconds();
        };

        PlayState.prototype.reset_mission = function () {
            this.mission_list = null;
            this.mission_idx = 0;
            this.end_house = null;
            this.create_mission();
        };

        PlayState.prototype.create = function () {
            this.game.stage.backgroundColor = 0x333333;
            var cars = [];

            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.setImpactEvents(true);
            this.HOUSE_MATERIAL = this.game.physics.p2.createMaterial();
            this.CABLE_MATERIAL = this.game.physics.p2.createMaterial();
            var slippery = this.game.physics.p2.createContactMaterial(this.HOUSE_MATERIAL, this.CABLE_MATERIAL, { friction: 0 });
            this.game.physics.p2.addContactMaterial(slippery);

            this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);

            var playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.playerCollisionGroup = playerCollisionGroup;
            this.cableCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.houseCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.game.physics.p2.updateBoundsCollisionGroup();

            //this.game.add.sprite(100, 100, "car");
            this.game.add.tileSprite(0, 0, this.game.width, this.game.height, "asphalt");

            this.houseGroup = this.game.add.group();
            var houseGroup = this.houseGroup;
            houseGroup.enableBody = true;
            houseGroup.physicsBodyType = Phaser.Physics.P2JS;
            this.game.physics.p2.friction = 100;

            this.collideSound = this.game.add.sound("collide");
            this.connectSound = this.game.add.sound("connect");
            this.motorSound = this.game.add.sound("motorsound");
            this.powerupSound = this.game.add.sound("powerup");

            this.nextMotorPlay = game.time.time;
            this.nextPuff = game.time.time;

            for (var y = 60; y <= game.height; y += this.HOUSE_SPACE * 2) {
                var lastWasCrossing = false;

                for (var x = 24; x <= game.width; x += this.HOUSE_SPACE) {
                    var row = (y - 50) / this.HOUSE_SPACE;
                    var col = (x - 30) / this.HOUSE_SPACE;

                    if ((row % 2 == 1 && col % 2 == 1)) {
                        continue;
                    } else if ((row % 2 == 1 || col % 2 == 1) && Math.random() < 0.5) {
                        continue;
                    }

                    if (Math.random() < 0.5) {
                        if (Math.random() < 0.1 || lastWasCrossing) {
                            var parkGfx = Math.random() > 0.75 ? "park1" : "park2";
                            var park = game.add.sprite(x, y, parkGfx);
                            park.anchor.setTo(0.5, 0.5);
                            lastWasCrossing = false;
                        } else {
                            lastWasCrossing = true;
                        }
                    } else {
                        var houseGfx = Math.random() > 0.25 ? "house1" : "house2";
                        var sprite = new states.House(this, x, y, houseGfx);
                        this.houseGroup.add(sprite);
                        var spriteBody = sprite.body;

                        var gardenTag = Math.random() > 0.5 ? "garden1" : "garden2";
                        if (Math.random() > 0.5) {
                            gardenTag = "garden3";
                        }
                        var garden = this.game.add.sprite(x, y + sprite.height, gardenTag);
                        garden.anchor.set(0.5, 1);

                        spriteBody.setRectangle(this.HOUSE_SIZE, this.HOUSE_SIZE);
                        spriteBody.setCollisionGroup(this.houseCollisionGroup);
                        spriteBody.collides([this.houseCollisionGroup, playerCollisionGroup, this.cableCollisionGroup]);
                        spriteBody.mass = 5;

                        spriteBody.setMaterial(this.HOUSE_MATERIAL);
                        spriteBody.fixedRotation = true;

                        var spriteLock = this.game.add.sprite(x, y);
                        this.game.physics.p2.enableBody(spriteLock, false);

                        var spriteLockBody = spriteLock.body;
                        spriteLock.body.dynamic = false;

                        this.game.physics.p2.createSpring(sprite, spriteLock, 0.01, 1000, 0.9);
                    }
                }
            }

            this.emitter = this.game.add.emitter(0, 0, 100);
            this.emitter.makeParticles("smoke");
            this.emitter.gravity = 0;
            this.emitter.setScale(0.3, 2, 0.3, 2, 1000, Phaser.Easing.Cubic.InOut, false);
            this.emitter.setAlpha(0.25, 0, 2000);
            this.emitter.setXSpeed(-25, 25);
            this.emitter.setYSpeed(-25, 25);

            this.badCar = new states.BadCar(this, -20, 56 * 2 + 16 + this.HOUSE_SPACE * 2 * Math.floor(Math.random() * 5));
            this.badCar.kill();

            //this.badCar.body.applyForce([-5, 0], this.badCar.x, this.badCar.y);
            this.player = new states.Player(this, 320, 320);

            var body = this.player.body;
            body.setCollisionGroup(playerCollisionGroup);
            body.collides(this.houseCollisionGroup, this.carHitHouse, this);

            /*
            this.emitter = this.game.add.emitter(0, 0, 100);
            this.emitter.makeParticles("particle");
            this.emitter.gravity = 200;
            this.emitter.setScale(1, 4, 1, 4, 1000, Phaser.Easing.Cubic.InOut, false);
            this.game.input.onDown.add(this.burst, this);
            */
            //GUI Stuff
            var cableIcon = game.add.sprite(0, 0, "cableUsedIcon");
            cableIcon.scale.setTo(2, 2);
            cableIcon.smoothed = false;
            this.cableUsedText = createText(32, -2, "#FFFFFF", 28, String(this.player.maxCable - this.player.cableUsed * this.player.SEGMENT_LENGTH) + "m");
            this.cableUsedText.setShadow(-5, -5, 'rgba(0,0,0,0.5)', 5);
            this.cableUsedText.stroke = '#000000';
            this.cableUsedText.strokeThickness = 3;

            this.activeEffectsIcon = game.add.sprite(20, this.game.height - 40, "powerup1");
            this.activeEffectsIcon.alpha = 1;
            this.activeEffectsText = createText(22, this.game.height - 36, "#FFFFFF", 14, "TEST");
            this.activeEffectsText.stroke = "#000000";
            this.activeEffectsText.strokeThickness = 1;

            this.reset_mission();
        };

        /*
        burst(pointer) {
        this.emitter.x = pointer.x;
        this.emitter.y = pointer.y;
        this.emitter.start(true, 2000, null, 10);
        }*/
        PlayState.prototype.carHitHouse = function (body1, body2) {
            this.collideSound.play();

            //console.log("Hit");
            //body2.sprite.alpha = 0.25;
            //game.add.tween(body2.sprite).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            // Shake the camera by moving it up and down 5 times really fast
            this.game.camera.y = 0;
            this.game.add.tween(this.game.camera).to({ y: -5 }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true).start();

            this.emitter.x = body2.x;
            this.emitter.y = body2.y + body2.sprite.height * 0.25;
            this.emitter.start(true, 1000, null, 5);
        };

        PlayState.prototype.update = function () {
            var dt = this.game.time.totalElapsedSeconds() - this.player.missionStartTime;
            if (dt > this.mission_time) {
                this.game.state.start("end");
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                if (this.game.time.time > this.nextMotorPlay) {
                    this.nextMotorPlay = this.game.time.time + 700;
                    this.motorSound.play();
                }

                if (this.game.time.time > this.nextPuff) {
                    this.emitter.x = this.player.x + Math.cos(this.player.rotation) * -this.player.SIZE.x / 2.0 + Math.random() * 6 - 3;
                    this.emitter.y = this.player.y + Math.sin(this.player.rotation) * -this.player.SIZE.y / 2.0 + Math.random() * 6 - 3;
                    this.emitter.start(true, 1000, null, 10);
                    this.nextPuff = this.game.time.time + 100;
                }
            }

            // secret keykodes for debugging
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.Y)) {
                this.end_mission();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
                this.game.state.start("end");
            }

            //Update the GUI in the werst possible manner
            this.cableUsedText.text = String(this.player.maxCable - this.player.cableUsed * this.player.SEGMENT_LENGTH) + "m" + "   " + Math.floor(this.mission_time - dt) + " seconds left " + "Scored " + this.player.score + " points";

            this.activeEffectsText.text = "";
            var shouldDisplayEffectIcon = false;
            for (var i = 1; i <= states.PowerUp.NUMBER_OF_POWERUPS; i++) {
                if (this.player.powerUpTakenTime[i] != 0) {
                    shouldDisplayEffectIcon = true;
                    var temp = "";
                    switch (i) {
                        case 1:
                            temp += "FASTER ";
                            break;
                    }
                    this.activeEffectsText.text += temp;
                }
            }
            this.activeEffectsIcon.alpha = Number(shouldDisplayEffectIcon);

            // check the cable end
            if (this.end_house) {
                if (this.end_house.house_hitbox(this.player)) {
                    this.end_house = null;
                    this.end_mission();
                }
            }

            if (Math.random() * 100 <= (this.game.time.totalElapsedSeconds() - this.lastPowerUpSpawn) / (3.14 * 2)) {
                var newPowerUp = new states.PowerUp(this, Math.random() * (this.game.width - 8) + 8, Math.round(Math.random() * 6) * 115 + Math.random() * 16, Math.round(Math.random()) + 1);
                this.lastPowerUpSpawn = this.game.time.totalElapsedSeconds();
            }
        };
        return PlayState;
    })(Phaser.State);
    states.PlayState = PlayState;
    function createText(x, y, color, size, text) {
        var style = { font: "65px Arial", fill: "#000000", align: "center" };
        var _text = game.add.text(x, y, text, style);
        _text.fontSize = size;
        _text.fill = color;
        return _text;
    }
})(states || (states = {}));
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="PlayState.ts" />
var states;
(function (states) {
    var EndState = (function (_super) {
        __extends(EndState, _super);
        function EndState(ps) {
            _super.call(this);
            this.ps = ps;
        }
        EndState.prototype.create = function () {
            this.input.onDown.addOnce(this.fadeOut, this);

            this.emitter = this.ps.game.add.emitter(this.ps.game.width / 2, 50, 1000);
            this.emitter.makeParticles("car");
            this.emitter.gravity = 50;
            this.emitter.setAlpha(0.25, 1.0, 2000);
            this.emitter.setXSpeed(-25, 25);
            this.emitter.setYSpeed(-25, 25);
            this.emitter.start(false, 100000, null, 100);

            this.createText(20, 100, "#00FF00", 24, "Connected:  " + (this.ps.player.housesConnected) + " houses");
            this.createText(20, 200, "#00FF00", 24, "Scored:     " + (this.ps.player.score));
            this.createText(20, 300, "#00FF00", 24, "Played for: " + Math.floor((this.ps.game.time.totalElapsedSeconds() - this.ps.player.gameStarted)) + " seconds");
            this.createText(20, 400, "#00FF00", 24, "Cable used: " + this.ps.player.cableUsed + " meters");
            this.createText(20, 500, "#FF0000", 24, "Press to play again");
        };

        EndState.prototype.update = function () {
            // if (this.game.input.keyboard.isDown(Phaser.Keyboard.ANY)) fadeOut();
            this.emitter.x = (this.emitter.x + 13 * Math.random()) % this.ps.game.width;
        };

        EndState.prototype.createText = function (x, y, color, size, text) {
            // I AM COPY PASTE FROM PLAYERSTATE
            var style = { font: "65px Arial", fill: "#000000", align: "center" };
            var _text = game.add.text(x, y, text, style);
            _text.fontSize = size;
            _text.fill = color;
            return _text;
        };

        EndState.prototype.fadeOut = function () {
            this.game.state.start("play", true, false);
        };
        return EndState;
    })(Phaser.State);
    states.EndState = EndState;
})(states || (states = {}));
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="BootState.ts" />
/// <reference path="PreloadState.ts" />
/// <reference path="TitleState.ts" />
/// <reference path="PlayState.ts" />
/// <reference path="EndState.ts" />
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.call(this, 800, 600, Phaser.AUTO, "phaser-example", null);
        this.state.add("boot", new states.BootState());
        this.state.add("preload", new states.PreloadState());

        // this.state.add("title", new states.TitleState());
        var ps = new states.PlayState();
        this.state.add("play", ps);
        this.state.add("end", new states.EndState(ps));
        this.state.start("boot");
    }
    return Game;
})(Phaser.Game);

var game = new Game();
