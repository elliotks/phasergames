import Phaser from "phaser";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        this.load.image("logo", "assets/images/logo.png");
        this.load.audio("music", "assets/sounds/muzik.mp3");
        this.load.bitmapFont("pixelFont", "assets/fonts/font.png", "assets/fonts/font.xml");
    }

    create () {
        this.logo = this.physics.add.sprite(100, 50, "logo");
        this.logo.setBounce(0.4);
        this.logo.setCollideWorldBounds(true);

        this.label = this.add.bitmapText(10, 50, "pixelFont", "Climber, press any key to start", 24);
        this.dynamic = this.add.bitmapText(0, 50, "pixelFont", "");
        this.sound.add("music", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.sound.play("music");
    }
}