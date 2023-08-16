

class Character extends Phaser.GameObjects.Sprite{
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.scene = scene;
        this.scene.add.existing(this);
        this.name = name;
        this.health = 100;
        this.attack = 10;
        this.defense = 10;
        this.level = 1;
        this.coins = 10;
    }
}

export default Character;
