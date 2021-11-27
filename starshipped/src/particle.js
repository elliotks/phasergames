class Particle extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, velocity = 1, color = 0xffffff, size = 4, alpha = 1) {
        super(scene, x, y, size, size, color);
        this.name = "bubble";
        this.scene = scene;
        this.alpha = alpha;
        this.setOrigin(0.5)
        this.setAlpha(this.alpha)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(600, 1000),
           // y: {from: this.y, to: this.y + (this.direction * Phaser.Math.Between(20, 40))},
            scale: { from: 1, to: 1.5 },
            alpha: { from: this.alpha, to: 0 },
            onComplete: () => { this.destroy() }
        });
    }
}

export default Particle;
