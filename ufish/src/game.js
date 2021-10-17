import Player from "./player";

import FishGenerator from "./objects/fish_generator";
import FoeGenerator from "./objects/foe_generator";
import Sky from "./objects/sky";
import Water from "./objects/water";
import Bullet from "./objects/bullet";

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
      this.time = data.time;
  }

    preload () {
    }

    create () {
      // this.add.tileSprite(0, 0, 800, 600, 'background1').setOrigin(0,0);
      // 494d7e
      console.log("Scene time: ", this.time);
      this.duration = this.time * 1000;
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.physics.world.setBounds(0, 0, 1600, 1200);
      this.finished = false;
      this.addSky();
      setTimeout(this.death.bind(this), 15000);

        this.player = new Player(this, this.center_width, 200 )//.setOrigin(0.5); // this.physics.add.sprite(100, 450, 'dude');

        this.physics.world.setBoundsCollision(false, true, true, true);

        this.add.image(60, 16, "redfish").setOrigin(0.5).setScale(0.5).setScrollFactor(0)
        this.scoreText = this.add.bitmapText(100, 16, "pixelFont", "0", 20).setOrigin(0.5).setScrollFactor(0)
        this.add.image(300, 16, "coin").setOrigin(0.5).setScrollFactor(0)
        this.coinsText = this.add.bitmapText(340, 16, "pixelFont", "0", 20).setOrigin(0.5).setScrollFactor(0)
        this.add.image(400, 16, "heart").setOrigin(0.5).setScrollFactor(0)
        this.hullText = this.add.bitmapText(440, 16, "pixelFont", this.player.hull, 20).setOrigin(0.5).setScrollFactor(0)

        this.deathText = this.add.bitmapText(this.center_width, this.center_height, "pixelFont", "YOU WERE HIT!!", 40).setOrigin(0.5).setAlpha(0)
       // this.loadAudios();

       // this.playMusic();

        this.fishGenerator = new FishGenerator(this);
        this.foeGenerator = new FoeGenerator(this);
       // this.overlap = this.physics.add.overlap(this.player.beamGroup, this.fishGenerator.fishGroup, this.trackFish);

       this.addWater();
       this.colliderPlayerSurface = this.physics.add.collider(this.water.surface, this.player, this.playerSurface);

       this.overlapFishWater = this.physics.add.overlap(this.water.surface, this.fishGenerator.fishGroup, this.surfaceTouch);
       this.overlapPlayer = this.physics.add.overlap(this.player, this.fishGenerator.fishGroup, this.catchFish);
       this.overlapPlayerFoe = this.physics.add.overlap(this.player, this.foeGenerator.foeGroup, this.player.hit);
       this.overlapFoeBeam = this.physics.add.overlap(this.player.beamGroup, this.foeGenerator.foeGroup, this.player.destroyBeam);

      }

      addSky() {
        this.sky = new Sky(this);
      }

      addWater() {
        this.water = new Water(this);
      }

      finishStage () {
          this.stageFinished = true;
      }

      trackFish (beam, fish) {
        fish.up(beam);
      }

      catchFish(player, fish) {
        player.scene.updateScore(1);
        fish.destroy()
      }

      playerSurface (surface, player) {

      }

      death () {
        this.fishGenerator.stop()
        this.foeGenerator.stop()
        this.water.stop();
          new Bullet(this, this.width, this.player.y, "missile", 1000, 1)
          this.player.death()
      }


      loadAudios () {
        this.audios = {
          "lock": this.sound.add("lock"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="music") {

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
        this.fishGenerator.update();
        this.foeGenerator.update();
    }

    finishScene () {
      this.sky.stop();
      // this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateContainers (amount) {
        this.registry.set("containers", amount);
    }

    updateHull (amount = 1) {
      this.registry.set("hull", amount);
    }
}