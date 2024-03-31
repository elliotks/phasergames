import { JumpSmoke, RockSmoke } from "./particle";
import { Dust } from "./dust";

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "block_blue", velocity = 50) {
    super(scene, x, y, name);
    this.setOrigin(0, 0);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setAllowGravity(true);
    this.body.setGravityY(0)
    //this.body.gravity.y = 0;
    //this.body.setDragY(300)
    this.name = name;
    this.velocity = velocity;
    this.sideVelocity = velocity/4;
    this.init();
  }

  init () {
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.scene.events.on("update", this.update, this);
  }

  update () {
    if (!this.active) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursor.up) || Phaser.Input.Keyboard.JustDown(this.W)) {

        this.body.setVelocityY(-this.velocity);
        //this.body.setGravityY(300)
        //this.anims.play("playerjump", true);
        //this.scene.playAudio("jump")
        this.burstSmoke();
    } else if (this.cursor.right.isDown || this.D.isDown) {
        if (Phaser.Math.Between(1,21) > 20)  new Dust(this.scene, this.x, this.y + 32)
        this.flipX = (this.body.velocity.x < 0);
        this.body.setVelocityX(this.sideVelocity);
    } else if (this.cursor.left.isDown || this.A.isDown) {
        if (Phaser.Math.Between(1,21) > 20)  new Dust(this.scene, this.x, this.y + 32)
        this.flipX = true;
        this.body.setVelocityX(-this.sideVelocity);
    }

    if (this.x < 0) this.scene.restartScene();
  }

  burstSmoke (dust = 20) {
    this.jumpSmoke(dust);
  }

  jumpSmoke (offsetY = 10, varX) {
      Array(Phaser.Math.Between(3, 6)).fill(0).forEach(i => {
          const offset = varX || Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
          varX = varX || Phaser.Math.Between(0, 20);
          new JumpSmoke(this.scene, this.x + (offset * varX), this.y + offsetY)
      })
  }
}
