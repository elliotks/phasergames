import Player from "./player";
import Block from "./block";
import Platform from "./platform";
import SeeSaw from "./seesaw";
import Swing from "./swing";
import DungeonGenerator from "./dungeon_generator";
import Dungeon from "@mikewesthad/dungeon";
import { Particle } from "./particle";

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
      this.registry.set("score", 0);
      this.registry.set("coins", 0);
      this.registry.set("keys", 0);
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      
      this.addMap();
      this.addPlayer();
      this.addCollisions();
      this.addCamera();
      this.addScores();
      //this.loadAudios(); 
      // this.playMusic();
    }

    addMap() {
      this.dungeon = new DungeonGenerator(this);
    }

    addMap2() {    
      this.map = this.make.tilemap({ key: "scene0" });
      const tileset = this.map.addTilesetImage("kenney-tileset-64px-extruded");
      const groundLayer = this.map.createLayer("Ground", tileset, 0, 0);
      const lavaLayer = this.map.createLayer("Lava", tileset, 0, 0);

      // Set colliding tiles before converting the layer to Matter bodies
      groundLayer.setCollisionByProperty({ collides: true });
      lavaLayer.setCollisionByProperty({ collides: true });

      this.matter.world.convertTilemapLayer(groundLayer);
      this.matter.world.convertTilemapLayer(lavaLayer);

  }

  addScores () {
    this.add.sprite(62, 26, "coin", 0).setOrigin(0.5).setScrollFactor(0)
    this.scoreCoins = this.add.bitmapText(100, 24, "default", "x0", 20).setOrigin(0.5).setScrollFactor(0)
    this.add.sprite(this.width - 100, 24, "keys", 0).setOrigin(0.5).setScrollFactor(0)
    this.scoreKeys = this.add.bitmapText(this.width - 48, 24, "default", "x0", 20).setOrigin(0.5).setScrollFactor(0)
  }

  addPlayer() {
      //const { x, y } = this.map.findObject("Spawn", obj => obj.name === "Spawn Point");
    this.trailLayer = this.add.layer();
    this.player = new Player(this, 
    this.dungeon.map.widthInPixels / 2,
    this.dungeon.map.heightInPixels / 2, 100);
  }

  addCollisions () {
    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      callback: this.onPlayerCollide,
      context: this
    });

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
      });
    });
  }

  onPlayerCollide({ gameObjectA, gameObjectB }) {
    //console.log("Player collide: ", gameObjectA, gameObjectB)
    if (!gameObjectB) return;
    if (gameObjectB.label === "coin") this.playerPicksCoin(gameObjectB);
    if (gameObjectB.label === "keys") this.playerPicksKey(gameObjectB);
    if (gameObjectB.label === "bat") this.playerHitsBat(gameObjectB);
    if (gameObjectB.label === "wizard") this.playerHitsBat(gameObjectB);
    if (gameObjectB.label === "fireball") this.playerHitsBat(gameObjectB);
    if (gameObjectB.name === "block") this.playerHitsBlock(gameObjectB);
    if (gameObjectB instanceof Platform) this.playerOnPlatform(gameObjectB);
    if (!(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

    const tile = gameObjectB;

    // Check the tile property set in Tiled (you could also just check the index if you aren't using
    // Tiled in your game)
    if (tile.properties.isLethal) {
      // Unsubscribe from collision events so that this logic is run only once
      this.unsubscribePlayerCollide();

      //this.player.freeze();
      this.restartScene();
    }
  }

  playerHitsBlock(block) {

  }

  playerOnPlatform(block) {

  }

  playerPicksCoin(coin) {
    this.showPoints(coin.x, coin.y, 1, this.scoreCoins);
    coin.destroy();
    this.updateCoins();
    console.log(coin.body)

  }

  playerHitsBat (bat) {
    bat.death();
    this.restartScene();
  }

  playerPicksKey(key) {
    this.updateKeys();
    this.showPoints(key.x, key.y, this.registry.get("keys")+"/"+this.dungeon.dungeon.rooms.length, this.scoreKeys);
    key.destroy();

  }

  showPoints (x, y, score, textElement, color = 0xffffff) {
    let text = this.add.bitmapText(x + 20, y - 80, "default", "+"+score, 20).setDropShadow(2, 3, color, 0.7).setOrigin(0.5);
    this.tweens.add({
        targets: text,
        duration: 1000,
        alpha: {from: 1, to: 0},
        x: {from: text.x + Phaser.Math.Between(-10, 10), to: text.x + Phaser.Math.Between(-40, 40)},
        y: {from: text.y - 10, to: text.y - 60},
        onComplete: () => {
            text.destroy()
        }
    });

    this.textUpdateEffect(textElement, color)
 }

  addCamera() {
              // Phaser supports multiple cameras, but you can access the default camera like this:
    this.cameras.main.setBounds(0, 0, this.dungeon.map.widthInPixels, this.dungeon.map.heightInPixels);
    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
    this.cameras.main.setBackgroundColor(0x25131a);
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

    }

    restartScene() {
      this.cameras.main.fade(250, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => this.scene.restart());
    }

    finishScene () {
      this.cameras.main.fade(250, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
      });
    }

    updateCoins (points = 1) {
        const coins = +this.registry.get("coins") + points;
        this.registry.set("coins", coins);
        this.scoreCoins.setText("x"+coins);
    }

    updateKeys (points = 1) {
      const keys = +this.registry.get("keys") + points;
      this.registry.set("keys", keys);
      this.scoreKeys.setText("x"+keys);
      if (keys === this.dungeon.dungeon.rooms.length) {
        this.finishScene()
      }
  }

  textUpdateEffect (textElement, color) {
    textElement.setTint(color);
    const prev = textElement.y;
    this.tweens.add({
      targets: textElement,
      duration: 100,
      alpha: {from: 1, to: 0.8},
      scale: {from: 1.2, to: 1},
      repeat: 5,
      onComplete: () => {
        textElement.setTint(0xffffff);
        textElement.y = prev;
      }
    });
   }
}
