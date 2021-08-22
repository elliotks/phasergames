class Container extends Phaser.Physics.Arcade.Sprite {
    constructor (scene) {
        const x = Phaser.Math.Between(800, 850);
        const y = Phaser.Math.Between(0, 600);
        super(scene, x, y, "container");
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setBounce(1)
        this.scene.add.existing(this);
        this.free = true;
        this.reward = 100;
        this.pickOverlap = this.scene.physics.add.overlap(this, this.scene.player, this.scene.player.pick, null, this.scene.player);

        this.body.setVelocityX(-100);
    }

    hit(asteroid, me) {
        console.log("Other asteroid hit!!");
    }
}

export default Container;