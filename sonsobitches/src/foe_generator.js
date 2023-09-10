import Foe from "./foe";

export default class FoeGenerator {
    constructor (scene) {
        this.scene = scene;
        this.frequency = 2000;
        this.generate();
    }

    generate() {
      this.scene.time.delayedCall(Phaser.Math.Between(this.frequency, this.frequency * 1.20), () => {
        this.scene.foes.add(new Foe(this.scene, this.scene.player.x + Phaser.Math.Between(-300, 300), this.scene.player.y + Phaser.Math.Between(-100, 100)))
        this.generate()
      }, null, this);
    }

    setFrequency (frequency) {
      this.frequency = frequency;
    }
}