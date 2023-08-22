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
            this.scene.start("game");
        }, this);

        /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        }); */

        // this.load.image("logo", "assets/images/logo.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");

        this.load.image("block_green", "assets/images/block_green.png");
        this.load.image("block_blue", "assets/images/block_blue.png");
        this.load.image("block_red", "assets/images/block_red.png");
        this.load.image("block_gold", "assets/images/block_gold.png");
        this.load.image("block_grey", "assets/images/block_grey.png");
        this.load.image("block_black", "assets/images/block_black.png");
        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");

        // this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
    }

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
