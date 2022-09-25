export default class Platform extends Phaser.GameObjects.Container {
    constructor (scene, x, y, size = 4, type = 3) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.type = type; 
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setBounce(1);
        this.body.setSize(size * 64, 64)
        this.body.setOffset(-2, -2)

        this.body.immovable = true;
        this.body.moves = false;
        this.chain = new Phaser.GameObjects.Sprite(this.scene, (size * 32) - 32, -2048, "chain").setOrigin(0);
        this.add(this.chain);
        this.platform = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "platform" + size).setOrigin(0);
        this.add(this.platform);
        
        this.init();
    }

    init() {
        let offsetX = this.x;
        let offsetY = this.y;

        switch (+this.type) {
            case 0: 
                offsetY = Phaser.Math.Between(0, 50); 
                break;
            case 1:
                offsetY = Phaser.Math.Between(0, 100); 
                break;
            case 2:
                offsetY = Phaser.Math.Between(0, 200); 
                break;
            case 3: 
            case 4:
            case 5:
            case 6: 
            case 6: 
            default: break;
        }
        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(4000, 6000),
            x: {from: this.x, to: offsetX},
            y: {from: this.y, to: offsetY},
            repeat: -1,
            yoyo: true
        })
    }
}