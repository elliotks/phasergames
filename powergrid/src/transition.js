export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
    }

    preload () {
    }

    create () {
        const messages = [
            "Tutorial",
            "Stage0",
            "Stage1",
            "Stage2",
            "Stage3",
            "Stage4",
            "Stage5",
            "Stage6",
            "Stage7",
            "Outro"
        ]

        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        
        //this.cameras.main.setBackgroundColor(0x3c97a6);
        //this.addStartButton();

        if (this.number === 2) {
            this.scene.start("outro", { name: this.name, number: this.number });
        }

        this.add.bitmapText(this.center_width, this.center_height - 200, "mario", messages[this.number], 40).setOrigin(0.5).setTint(0xb95e00).setDropShadow(2, 3, 0xfffd00, 0.7);
        this.add.bitmapText(this.center_width, this.center_height - 160, "mario", "Ready?", 30).setOrigin(0.5).setTint(0xb95e00).setDropShadow(2, 3, 0xfffd00, 0.7);
        this.addStageBulbs();
        this.time.delayedCall(1000, () => this.loadNext(), null, this);
    }

    update () {
        
    }

    addStageBulbs() {
        Array(5).fill(0).forEach((_, i) => {
            const shouldTween = i === this.number;
            const bulbIndex = i < this.number ? 1 : 0; 
            const bulb = this.add.sprite(20 + (i*50), this.center_height, "bulb", bulbIndex);
            if (shouldTween) {
                this.tweens.add({
                    targets: [bulb],
                    scale: {from: 0.8, to: 1},
                    repeat: -1,
                    duration: 200
                })
            }
        })
    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 500, "mario", "Click to start", 30).setOrigin(0.5).setTint(0xfffd00).setDropShadow(2, 3, 0x693600, 0.7);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.sound.add("move").play();
            this.loadNext();
        });
    
        this.startButton.on('pointerover', () => {
            this.startButton.setTint(0x3E6875)
        });
    
        this.startButton.on('pointerout', () => {
            this.startButton.setTint(0xffffff)
        });
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }

    loadNext () {
        this.scene.start("game", { name: this.name, number: this.number, limitedTime: 10 + (this.number * 3) });
    }
}
