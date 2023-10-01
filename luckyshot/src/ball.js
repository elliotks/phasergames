export default class Ball {
    constructor (scene, x, y) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.limitY = y;
        this.body1 = this.scene.matter.add.circle(x, this.limitY, 32, { isStatic: true });

        //this.add(this.body1);

        this.fireball = new Fireball(this.scene, x, y + 100)//this.scene.matter.add.circle(150, 250, 16);
       // this.add(this.body2);
                //  A spring, because length > 0 and stiffness < 0.9
        this.spring = this.scene.matter.add.spring(this.body1, this.fireball, 40, 0.01);

       // this.scene.physics.add.existing(this);
       this.scene.matter.add.mouseSpring();
       this.readyToFire = false;
       this.firing = false;
       this.dead = false;
       this.scene.events.on("update", this.update, this);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this.body1,
            y: "-=5",
            yoyo: true,
            duration: 400,
            repeat: -1
        });
    }

    update () {
        if (this.dead) return;
        if (this.scene.pointer.isDown) {
            if (this.scene.pointer.leftButtonDown()) {
                console.log("Mouse down")
                this.readyToFire = true;
            }
        } else if (this.readyToFire && !this.scene.pointer.isDown) {
            this.readyToFire = false;
            this.firing = true;
            this.scene.matter.world.remove(this.body1)
            this.scene.time.delayedCall(100, () => {this.scene.matter.world.remove(this.spring)}, null, this)

        }
        if(this.firing && this.fireball && this.fireball !== undefined && this.fireball.y - 10 <= this.limitY)  {
            //this.scene.matter.world.remove(this.spring)
        }
    }

    death () {
        this.fireball.visible = false;
        this.dead = true;
    }
}

class Fireball extends Phaser.Physics.Matter.Sprite  {
    constructor (scene, x, y) {
        super(scene.matter.world, x, y, "fireball", 0)
        this.label = "fireball";
        this.scene = scene;
        scene.add.existing(this)
        //scene.physics.add.existing(this);

       // this.setIgnoreGravity(true)
        this.setBounce(1)
        this.init();
    }

    init () {
        this.scene.events.on("update", this.update, this);
        this.tween = this.scene.tweens.add({
            targets: this,
            duration: 200,
            scale: {from: 0.9, to: 1},
            repeat: -1
        });
       // this.scene.time.delayedCall(3000, () => {this.destroy()}, null, this)
    }

    update() {
        if (this.scene?.gameOver) return;
        //if (Phaser.Math.Between(0,5)> 4)
           // this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y, 0xffffff, 4, false));
    }

    death () {
        this.destroy();
    }

    destroy () {
        this.tween.destroy();
        super.destroy();
    }
  }
