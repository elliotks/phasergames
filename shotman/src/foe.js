import EasyStar from "easystarjs";

export default class Foe extends Phaser.GameObjects.Container  {
    constructor (scene, x, y, grid) {
        super(scene, x, y);
        this.name = "ghost";
        this.setScale(1)
        this.grid = grid;
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setSize(64, 64)
        this.sprite = this.scene.add.sprite(0, 0 , "ghost");
        this.sprite.setOrigin(0)
        this.shadow = this.scene.add.sprite(12, 64, "shadow");
        this.shadow.setOrigin(0)
        this.add(this.shadow);
        this.add(this.sprite);
        this.easystar = new EasyStar.js();
       this.init();
    }

    init () {
      this.easystar.setGrid(this.grid);
      this.easystar.setAcceptableTiles([0]);
      this.scene.events.on("update", this.update, this);
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            repeat: -1,
            scale: {from: 0.95, to: 1},
            yoyo: true
        })

        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
          });

          this.scene.anims.create({
            key: this.name + "death",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
            frameRate: 5
          });
  
          this.sprite.anims.play(this.name, true)
          //this.body.setVelocityX(this.direction * 100);
          this.flipX = this.direction < 0;
          this.on('animationcomplete', this.animationComplete, this);

          console.log("Created ghost")
          this.launchMove();
    }


    launchMove() {
      if (!this.scene) return;
      this.delayedMove = this.scene.time.addEvent({
          delay: 3000,                // ms
          callback: this.move.bind(this),
          startAt: 0,
          callbackScope: this,
          loop: true
      });
    }

    move () {
      try {
          if (this.moveTimeline) this.moveTimeline.destroy();
//          console.log(Math.floor(this.x/64), Math.floor(this.y/64), Math.floor(this.scene.player.x/64), Math.floor(this.scene.player.y/64), this.grid)
          this.easystar.findPath(Math.floor(this.x/64), Math.floor(this.y/64), Math.floor(this.scene.player.x/64), Math.floor(this.scene.player.y/64), this.moveIt.bind(this));
          this.easystar.setIterationsPerCalculation(10000);
          this.easystar.enableSync();
          this.easystar.calculate();
      } catch (err) {
          console.log("Cant move yet: ", err)
      }

  }

  moveIt (path) {
      if (path === null) {
          console.log("Path was not found.");
      } else {
          let tweens = [];
          this.i = 0;
          this.path = path;
          for(let i = 0; i < path.length-1; i++){
              let ex = path[i+1].x * 64;
              let ey = path[i+1].y * 64;
              tweens.push({
                  targets: this,
                  duration: 500,
                  x: ex,
                  y: ey
              });
          }
      
          this.moveTimeline = this.scene.tweens.timeline({
              tweens: tweens,
              onComplete: () => {
                  this.delayedMove.remove()
                  this.launchMove();
              }
          });
      }
  }


    update () {
    }

    turn () {
        this.direction = -this.direction;
        this.flipX = this.direction < 0;
        this.body.setVelocityX(this.direction * 100);
    }

    death () {
        this.dead = true;
        this.body.enable = false;
        this.body.rotation = 0;
        this.anims.play(this.name + "death")
      }

      animationComplete(animation, frame) {
        if (animation.key === this.name +"death") {
          //this.destroy()
        }
    }

    freeze () {
      this.setAlpha(0);
      this.body.enable = false;
      this.scene.time.delayedCall(5000, () => {
        this.setAlpha(1);
        this.body.enable = true;
      }, null, this);
    }
}

