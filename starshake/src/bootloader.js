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
                this.progressBar.fillStyle(0x0088aa, 1);
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

        this.load.image("logo", "assets/images/logo.png");
        this.load.image("pello_logo", "assets/images/pello_logo.png");
        this.load.audio("shot", "assets/sounds/shot.mp3");
        this.load.audio("foeshot", "assets/sounds/foeshot.mp3");
        this.load.audio("foedestroy", "assets/sounds/foedestroy.mp3");
        this.load.audio("foexplosion", "assets/sounds/foexplosion.mp3");
        this.load.audio("explosion", "assets/sounds/explosion.mp3");
        this.load.audio("stageclear1", "assets/sounds/stageclear1.mp3");
        this.load.audio("stageclear2", "assets/sounds/stageclear2.mp3");
        this.load.audio("boss", "assets/sounds/boss.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        Array(3).fill(0).forEach((_,i) => {
            this.load.audio(`music${i+1}`,`assets/sounds/music${i+1}.mp3`)
        });

        Array(4).fill(0).forEach((_,i) => {
            this.load.image(`stage${i+1}`,`assets/images/stage${i+1}.png`)
        });
        this.load.image("background", "assets/images/background.png");
        this.load.bitmapFont("wendy", "assets/fonts/wendy.png", "assets/fonts/wendy.xml");
        this.load.spritesheet("player1", "assets/images/player1.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("foe0", "assets/images/foe0.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("foe1", "assets/images/foe1.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("foe2", "assets/images/foe2.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("guinxu", "assets/images/guinxu.png", { frameWidth: 128, frameHeight: 144 });
        this.load.spritesheet("plenny0", "assets/images/plenny0.png", { frameWidth: 64, frameHeight: 64 });

        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("score_player1", 0);
        this.registry.set("power_player1", "water");
        this.registry.set("lives_player1", 0);

        this.registry.set("score_player2", 0);
        this.registry.set("power_player2", "water");
        this.registry.set("lives_player2", 0);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xd40000, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
