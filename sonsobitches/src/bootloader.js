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

        Array(4).fill(0).forEach((_,i) => {
            this.load.image(`gold${i}`, `assets/images/gold${i}.png`);
        });

        this.load.audio("gold", "assets/sounds/gold.mp3");
        this.load.audio("shell", "assets/sounds/shell.mp3");
        this.load.audio("step", "assets/sounds/step.mp3");
        this.load.audio("stone", "assets/sounds/stone.mp3");
        this.load.audio("yee-haw", "assets/sounds/yee-haw.mp3");
        this.load.audio("explosion", "assets/sounds/explosion.mp3");
        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("cock", "assets/sounds/cock.mp3");
        this.load.audio("shot", "assets/sounds/shot.mp3");
        this.load.audio("empty", "assets/sounds/empty.mp3");
        this.load.audio("ghost", "assets/sounds/ghost.mp3");
        this.load.audio("ghostdead", "assets/sounds/ghostdead.mp3");
        this.load.audio("dead", "assets/sounds/dead.mp3");
        this.load.audio("goddam", "assets/sounds/goddam.mp3");
        this.load.audio("sons", "assets/sounds/sons.mp3");
        this.load.image("cave", "assets/maps/cave.png");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");
        this.load.audio("tutorial", "assets/sounds/tutorial.mp3");

        this.load.spritesheet("ghost", "assets/images/ghost.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("willie", "assets/images/willie.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("shell", "assets/images/shell.png", { frameWidth: 32, frameHeight: 32 });
        this.load.image("tnt", "assets/images/tnt.png");
        this.load.spritesheet("shot", "assets/images/shot.png", { frameWidth: 32, frameHeight: 32 });

        this.load.image("ghosts", "assets/images/ghost.png");
        this.load.image("shadow", "assets/images/shadow.png");
        this.load.image("pello_ok", "assets/images/pello_ok.png");

        this.load.bitmapFont("default", "assets/fonts/shotman.png", "assets/fonts/shotman.xml");
        this.load.spritesheet("chopper", "assets/images/chopper.png", { frameWidth: 128, frameHeight: 128 });


        this.load.tilemapTiledJSON("scene", "assets/maps/scene.json");

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
