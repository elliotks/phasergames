export default class Bootloader extends Phaser.Scene {
    constructor () {
        super({ key: "bootloader" });
    }

    preload () {
        this.createBars();
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0x902406, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );
        this.load.on("complete", () => {
            this.scene.start("splash");
        },this);

        Array(5).fill(0).forEach((_,i) => {
            this.load.audio(`music${i}`,`assets/sounds/music${i}.mp3`)
        });

       this.load.audio("background", "assets/sounds/background.mp3");
       this.load.image("pello", "assets/images/pello.png");
       this.load.image("holycrab", "assets/images/holycrab.png");
       this.load.image("block", "assets/images/block.png");
       this.load.image("shell", "assets/images/shell.png");
       this.load.image("cloud", "assets/images/cloud.png");
       this.load.image("arrow", "assets/images/arrow.png");
       this.load.audio("block", "assets/sounds/block.mp3");
       this.load.audio("end", "assets/sounds/end.mp3");
       this.load.audio("explosion", "assets/sounds/explosion.mp3");
       this.load.audio("hit", "assets/sounds/hit.mp3");
       this.load.audio("jump", "assets/sounds/jump.mp3");
       this.load.audio("streak", "assets/sounds/streak.mp3");
       this.load.bitmapFont("wendy", "assets/fonts/wendy.png", "assets/fonts/wendy.xml");
        this.load.bitmapFont("arcade", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
        this.load.spritesheet("crab", "assets/images/crab.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("crab2", "assets/images/crab2.png", { frameWidth: 48, frameHeight: 48 });

        this.load.spritesheet("seagull", "assets/images/seagull.png", { frameWidth: 64, frameHeight: 48 });
    }
wendy
    create () {}

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xdc5914, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
