import blockTypes from "./block_types";

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
                this.progressBar.fillStyle(0x88d24c, 1);
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

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

       /* blockTypes.forEach(i => {
            this.load.image(i.type, `assets/images/${i.type}.png`);
        });*/

       // this.load.audio("muzik", "assets/sounds/muzik.mp3");
        this.load.image("ship1_1", "assets/images/ship1_1.png");
        this.load.image("pello", "assets/images/pello.png");
       /*  this.load.audio("beam", "assets/sounds/beam.mp3");*/


        this.load.bitmapFont("arcade", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
        this.load.spritesheet("shot", "assets/images/shot.png", { frameWidth: 32, frameHeight: 32 });
    }

    create () {}

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x008483, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
