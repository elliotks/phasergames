import Block from "./block";
import BlockGenerator from "./block_generator"
import Player from "./player";

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

      this.addBoundLayer();
      this.addLands();
      this.addLetters();

      //this.cameras.main.startFollow(this.player)

      //this.loadAudios(); 
      // this.playMusic();
    }

    addBoundLayer() {
      this.boundLayer = this.add.rectangle(-200, 0, 20, 1000, 0x00ff00).setOrigin(0, 0);
      this.physics.add.existing(this.boundLayer);
      this.boundLayer.body.setAllowGravity(false);
    }

    addLands () {
      this.shots = this.add.group();
      this.breakableBlocks = this.add.group();
      this.blocks = this.add.group();
      this.growStart = 0;

      this.createPool();

      this.growLand(32);

      this.physics.add.overlap(this.shots, this.breakableBlocks, this.shotBlock, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.boundLayer, this.breakableBlocks, this.destroyBlock, ()=>{
        return true;
      }, this);
      this.physics.add.overlap(this.boundLayer, this.blocks, this.destroyBlock, ()=>{
        return true;
      }, this);
    }

    addLetters() {
      this.letters = this.add.group();
      this.explosions = this.add.group();
      this.leftColliders = this.add.group();
      this.rightColliders = this.add.group();
      this.blockGenerator = new BlockGenerator(this);

      this.physics.add.collider(this.letters, this.blocks, this.hitBlock, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.letters, this.breakableBlocks, this.hitBlock, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.letters, this.letters, this.hitBalls, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.rightColliders, this.leftColliders, this.joinRightLeftLetter, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.leftColliders, this.rightColliders, this.joinLeftRightLetter, ()=>{
        return true;
      }, this);

      this.blockGenerator.generate();
    }

    joinRightLeftLetter(right, left) {
      console.log("PArent: ", right.parentContainer.letter, " with: " , left.parentContainer.letter)
      if (right.parentContainer.sticky)
        right.parentContainer.joinRight(left.parentContainer);
    }

    joinLeftRightLetter(right, left) {
      if (right.parentContainer.sticky)
        right.parentContainer.joinLeft(left.parentContainer);
    }

    explode(ball, explosion) {
      ball.react();
    }

    hitBalls (ball, player) {
      
    }

    hitBlock (ball, block) {
    }

    destroyBlock(layer, block) {
      block.destroy()
      block = null;
    }

    createPool() {
      this.blockPool = [];
      this.blockPool = Array(1000).fill(0).map((_,i) => new Block(this, -100, -100, Phaser.Math.Between(0, 1), true, 1))
    }

    freeBlock () {
      return Phaser.Math.RND.pick(this.blockPool.filter(block => block.free))
    }

    growLand(length = 5) {
      let i = 0;
      for (i = 0; i < length; i++) {
        let block1 = this.freeBlock().reuse(this.growStart + (i * 32), 32, true, 1, false)
        let block2 = this.freeBlock().reuse(this.growStart + (i * 32), 700, true, -1, false)
        this.blocks.add(block1)
        this.blocks.add(block2);
      }

      for (i = 0; i < length; i++) {
        let block1 = this.freeBlock().reuse(0, (i * 32), true, 1, false)
        let block2 = this.freeBlock().reuse(1000, (i * 32), true, -1, false)
        this.blocks.add(block1)
        this.blocks.add(block2);
      }

      this.growStart += length * 32;
    }

    onWorldBounds (body, t) {
      console.log("World bound!! ", body.gameObject.name)
      const name = body.gameObject.name.toString();

      if (["block0", "block1" ,"shot"].includes(name)) {
        console.log("Destroyed!! ", body.gameObject.name)
        body.gameObject.destroy();
      }
    }

    shotBlock(shot, block) {
      console.log("Hit block")
      shot.destroy();
      block.destroy();
    }

    addPlayer () {
      this.player = new Player(this, 200, 200);

      this.physics.add.collider(this.player, this.blocks, this.crashPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.breakableBlocks, this.crashPlayer, ()=>{
        return true;
      }, this);
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

    update(delta, time) {
      if (this.player) this.player.update();
    }

  
    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
