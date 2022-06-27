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
                this.progressBar.fillStyle(0x0777b7, 1);
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
            this.scene.start("splash", { name: "tutorial", number: 0 });
        },this);

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        //
        // this.load.audio("beam", "assets/sounds/beam.mp3");

        this.load.bitmapFont("wendy", "assets/fonts/wendy.png", "assets/fonts/wendy.xml");
        this.load.bitmapFont("pixelFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
        this.load.spritesheet("johnny", "assets/images/johnny.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("fireball", "assets/images/fireball.png",  { frameWidth: 32, frameHeight: 32 });
        this.load.image("shot", "assets/images/shot.png");
        this.load.image('bubble', 'assets/images/bubble.png');
        this.load.image('volcano', 'assets/images/volcano.png');
        this.load.image('water_volcano', 'assets/images/water_volcano.png');
        this.load.image('mine', 'assets/images/mine.png');
        this.load.spritesheet("ember", "assets/images/ember.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("ember_head", "assets/images/ember_head.png", { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("fish", "assets/images/fish.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("explosion", "assets/images/explosion.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("blue_explosion", "assets/images/blue_explosion.png", { frameWidth: 32, frameHeight: 32 });
        this.load.image('cave', 'assets/maps/cave.png');
        Array(2).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });


        Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });

        this.load.audio("fireball", "assets/sounds/fireball.mp3");
        this.load.audio("water_volcano", "assets/sounds/water_volcano.mp3");
        this.load.audio("volcano", "assets/sounds/volcano.mp3");
        this.load.audio("explosion", "assets/sounds/explosion.mp3");


        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("game", "assets/sounds/game.mp3");
        this.load.audio("outro", "assets/sounds/outro.mp3");
        this.load.image("pello", "assets/images/pello.png");

        this.registry.set("score", 0);
        this.registry.set("embers", 0);
        this.registry.set("health", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xffa609, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
