import Utils from "./utils";

export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();

        this.add.tileSprite(0, 0, 800, 600, "landscape").setOrigin(0);
        this.utils = new Utils(this);
        this.title = this.add.bitmapText(this.center_width, this.center_height + 100, "pico", "MARSTRANDED", 60).setTint(0x6b140b).setAlpha(0).setDropShadow(0, 4, 0x6b302a, 0.9).setOrigin(0.5)
        this.tweens.add({
            targets: this.title,
            alpha: {from: 0, to: 1},
            duration: 4000
        })

        this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    playMusic (theme="mars_background") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1.5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
    }

    startSplash () {
        this.sound.stopAll();
        this.theme.stop();
        this.scene.start("splash");
    }
}
