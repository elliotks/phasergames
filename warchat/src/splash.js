import Chat from "./chat";


export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;


        this.cameras.main.setBackgroundColor(0x000000);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        //this.playMusic();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 0, time: 30})
    }

    showLogo() {
        this.gameLogo = this.add.bitmapText(this.center_width, 450, "mainFont", "WarChat", 120).setOrigin(0.5);
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            y: {
                from: -200,
                to: 330
              },
          })
    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 450, "pixelFont", "Welcome to Warchat!", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 500, "pixelFont", "!help", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "Press SPACE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}


//https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=qm00ypzqwzedlhlsr258825uzrnxuu&redirect_uri=http://localhost:8080&scope=chat%3Aread+chat%3Aedit+moderator%3Aread%3Achatters
