import Player from "./player";
import { Debris } from "./particle";
import Bat from "./bat";
import Snake from "./snake";
import Turn from "./turn";
import Platform from "./platform";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number;
  }

    preload () {
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      
      this.createMap();

      this.cameras.main.setBackgroundColor(0x000044)
      this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.addPlayer();

      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      this.physics.world.enable([ this.player ]);
      //this.loadAudios(); 
      // this.playMusic();
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("softbricks");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);

      this.batGroup = this.add.group();
      this.snakeGroup = this.add.group();
      this.foesGroup = this.add.group();
      this.turnGroup = this.add.group();
      this.exitGroup = this.add.group();
      this.platformGroup = this.add.group();
      this.bricks = this.add.group();

      this.objectsLayer.objects.forEach( object => {
        if (object.name === "bat") {
          let bat = new Bat(this, object.x, object.y, object.type);
          this.batGroup.add(bat)
          this.foesGroup.add(bat)
        }

        if (object.name === "snake") {
          let snake = new Snake(this, object.x, object.y, object.type);
          this.snakeGroup.add(snake);
          this.foesGroup.add(snake);
        }

        if (object.name === "platform") {
          this.platformGroup.add(new Platform(this, object.x, object.y, object.type))
        }

        if (object.name === "turn") {
          this.turnGroup.add(new Turn(this, object.x, object.y))
        }

        if (object.name === "exit") {
          this.exitGroup.add(new Turn(this, object.x, object.y, object.width, object.height, object.type).setOrigin(0.5))
        }
      });

      this.physics.add.collider(this.batGroup, this.platform, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.snakeGroup, this.bricks, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.batGroup, this.bricks, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.snakeGroup, this.turnGroup, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.snakeGroup, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);
    }

    turnFoe (foe, platform) {
      foe.turn();
    }

    hitFloor() {

    }

    addPlayer() {
      this.elements = this.add.group();

      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0);

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.platformGroup, this.hitFloor, ()=>{
        return true;
      }, this);
  
      this.physics.add.collider(this.player, this.bricks, this.hitFloor, ()=>{
        return true;
      }, this);
  
      this.physics.add.overlap(this.player, this.exitGroup, () => { 
        this.time.delayedCall(1000, () => this.finishScene(), null, this);
      }, ()=>{
        return true;
      }, this);

      this.blows = this.add.group();

      this.physics.add.overlap(this.blows, this.platform, this.blowPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.blows, this.bricks, this.blowBrick, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.blows, this.foesGroup, this.blowFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.batGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.snakeGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

    }

    hitPlayer(player, foe) {
      player.die();
    }

    blowFoe(blow, foe) {
      foe.destroy();
    }

    blowPlatform (blow, platform) {
      const tile = this.getTile(platform)
      if (this.isBreakable(tile)) {
        blow.destroy();
        Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
        this.platform.removeTileAt(tile.x, tile.y);
      }
    }

    blowBrick (blow, brick) {
      console.log("Blow brick" ,brick)
      blow.destroy();
      Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, brick.x, brick.y))
      brick.destroy();
    }

    getTile(platform) {
      const {x, y} = platform;
      return this.platform.getTileAt(x, y);
    }

    isBreakable (tile) {
      return tile?.properties['element'] === "break"
    }

    hitFloor(player, platform) {
      if (this.player.jumping && !this.player.falling && this.player.body.velocity.y === 0) {
        console.log(this.player.body.velocity.y) 
        const tile = this.getTile(platform)
        console.log(platform, "Falling: ", this.player.falling)
        if (this.isBreakable(tile)) {
          console.log("Hit while jump: ", tile, platform)
          Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
          this.platform.removeTileAt(tile.x, tile.y);
        } else if (platform?.name === "brick0") {
          Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, platform.x, platform.y))
          platform.destroy();
        }
      }
    }

      loadAudios () {
        this.audios = {
          "beam": this.sound.add("beam"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="game") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    update() {
      this.player.update();
    }

    finishScene () {
      if (this.theme) this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    restartScene () {
      this.time.delayedCall(1000, () => {
          if (this.theme) this.theme.stop();
          this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number});
        },
        null,
        this
      );
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
