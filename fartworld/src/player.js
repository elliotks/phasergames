export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        console.log(scene, x, y, name)
        super(scene, x, y, name)
        this.scene = scene;
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.init();
    }

    init () {
        this.body.setBounce(0.2);
        this.body.setCollideWorldBounds(true);

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('grogu', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'grogu', frame: 0 } ],
            frameRate: 20
        });
    
        this.scene.anims.create({
            key: 'crouch',
            frames: [ { key: 'grogu', frame: 7 } ],
            frameRate: 20
        });
    
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('grogu', { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.scene.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNumbers('grogu', { start: 7, end: 0 }),
            frameRate: 5
        });
    }

    update() {
        if (this.scene.cursors.left.isDown)
        { 
            this.body.setVelocityX(-160);
            this.anims.play('left', true);
        }
        else if (this.scene.cursors.right.isDown)
        {
           this.body.setVelocityX(160);
           this.anims.play('right', true);
        }
        else if (this.scene.cursors.down.isDown)
        {
            this.anims.play('crouch', true);
        }
        else
        {
            this.body.setVelocityX(0);
    
            this.anims.play('turn');
        }
    
        if (this.scene.cursors.up.isDown && this.body.blocked.down)
            {
    
                this.anims.play('jump', true);
                this.body.setVelocityY(-400);
            }
    }
}