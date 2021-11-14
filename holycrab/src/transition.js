export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.next = data.next;
    }

    preload () {
    }

    create () {
        const messages = {
            "stage1": "ARROWS/WASD + SPACE",
            "up": "Up there is your friend",
            "down": "Time to escape both crabs!!",
            "buggy": "Hit the sand!!",
            "outro": "You did it!!"
        }
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        //this.transition = this.sound.add("transition");
        //this.transition.play();

        this.add.bitmapText(this.center_width, this.center_height - 20, "arcade", messages[this.next], 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "arcade", "Ready?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);

        setTimeout(() => this.loadNext(), 3000);
    }

    update () {
    }

    loadNext () {
        this.scene.start(this.next, { name: this.name });
    }
}
