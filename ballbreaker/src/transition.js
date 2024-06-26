export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
    }

    preload () {
    }

    create () {
        const messages = {
            "game": "ARROWS/WASD + SPACE",
            "underwater": "You lost your engine!",
            "depth": "Time to go down!",
            "escape": "Go up and escape!",
            "outro": "You did it!!"
        }
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x006fb1);
        this.add.bitmapText(this.center_width, 100, "daydream", "Stage " + this.number, 40).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
        this.add.bitmapText(this.center_width, this.height - 100, "daydream", "Ready?", 30).setOrigin(0.5).setDropShadow(0, 3, 0x222222, 0.9);
        this.add.bitmapText(this.center_width, this.height - 50, "daydream", "CLICK to START", 30).setOrigin(0.5).setDropShadow(0, 3, 0x222222, 0.9);

        this.addScenario();
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.input.on('pointerdown', (pointer) => this.loadNext(), this);
        this.time.delayedCall(10000, () => this.loadNext(), null, this)
        this.playMusic();
    }

    update () {
    }

    addScenario() {

        let positions = [
            {x: 150, y: 300}, {x: 300, y: 300}, {x: 450, y: 300}, {x: 600, y: 300},
        ]
        positions = positions.concat(positions.map(position => ({x: position.x, y: position.y + 150})).reverse())
        positions = positions.concat([{x: 150, y: 600}, {x: 300, y: 600}])
        this.lines = this.add.layer();
        positions.forEach((position, i) => {
            const {x, y} = position;
            const index = this.number > i ? 1 : 0;
            this.add.bitmapText(x, y - 32, "daydream", "Stage " + (i+1), 10).setOrigin(0.5).setDropShadow(0, 3, 0x222222, 0.9);
            this.add.sprite(x, y, "points", index).setScale(1.2)
            if (i !== 3 && i !== 4 && i !== 9)
                this.lines.add(this.add.rectangle(x, y, 150, 10, 0xffffff).setOrigin(0, 0.5))            
        })

        this.lines.add(this.add.rectangle(600, 300, 10, 150, 0xffffff).setOrigin(0.5, 0))
        this.lines.add(this.add.rectangle(150, 450, 10, 150, 0xffffff).setOrigin(0.5, 0))

        const character = this.add.sprite(150, 300, "brick0").setOrigin(0.5)


        if (this.number > 0) {
            const origin = positions[this.number -1 ]
            const destiny = positions[this.number]
            this.tweens.add({
                targets: character,
                x: {from: origin.x, to: destiny.x},
                y: {from: origin.y, to: destiny.y},
                duration: 1000,
                onComplete: () => {
                    this.tweens.add({
                        targets: character,
                        scaleX: {from: 0.9, to: 1},
                        y: "-=5",
                        yoyo: true,
                        duration: 200,
                        repeat: -1
                    })
                }
            })
        }
    }

    playMusic (theme="theme") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
    }

    loadNext () {
        this.theme.stop();
        this.game.sound.stopAll();
        if (this.number < 10) {
            this.scene.start("game", { name: this.name, number: this.number });
        } else {
            this.sound.stopAll();
            this.scene.start("outro");
        }

    }
}
