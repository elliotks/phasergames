import Utils from "./utils";

export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.number = data.number;
    }

  /*

  */
    create () {
        this.missions = [ "", "Go north, locate containers.",
            "Find landing zone. North East.", "Locate landing, South East.",
            "Go East, locate containers.", "Other landings: North East",
            "Find out ship origin...",
        ];

        this.utils = new Utils(this);
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.add.tileSprite(0, 0, 800, 600, "landscape").setOrigin(0);

        if (this.number === 7) {
            this.scene.start("outro", { number: this.number });
        } else {
            this.sound.stopAll();
        }

        this.showInstructions();

        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
    }

  /*

  */
    showInstructions () {
        const listOfDays = Array(8).fill(0).map((_, i) => `DAY ${i}`)
        this.text1 = this.add.bitmapText(this.center_width, 20, "pico", listOfDays[this.number], 30)
            .setOrigin(0.5).setAlpha(0)
        this.text2 = this.add.bitmapText(this.center_width, 70, "pico", "AUDIO RECORD OF CAPTAIN BRAUN", 20)
            .setOrigin(0.5).setAlpha(0)

        if (this.number > 0) {
            this.showSceneInstructions();
        } else {
            this.showFirstInstructions();
        }
    }

  /*

  */
    showSceneInstructions () {
        this.tweens.add({
            targets: [this.text1, this.text2, this.play],
            duration: 1000,
            alpha: {from: 0, to: 1},
            onComplete: () => {
                this.playDiary();
            }
        })
    }

    showFirstInstructions () {
        this.playBackground();
        this.text2 = this.add.bitmapText(this.center_width, 70, "pico", "THE CRASH", 20)
            .setOrigin(0.5).setAlpha(0)
        this.playCreepy();
        this.tweens.add({
            targets: [this.text1],
            duration: 2000,
            alpha: {from: 0, to: 1},
            onComplete: () => {
                this.playIntro();
            }
        })
    }

  /*

  */
    playIntro () {
        const text =
            "YOU JUST CRASHED ON MARS\n"+
        "YOU ARE ALIVE BUT YOUR\n"+
        "SHIP IS COMPLETELY LOST\n" +
        "IF YOU WANT TO LIVE YOU\n" +
        "MUST FIND LANDING REMAINS\n" +
        "TRY GOING EAST...";

        this.utils.typeText(text, "pico", this.center_width, 150, 0xffffff, 20)
    }

  /*

  */
    playBackground () {
        const theme =  "mars_background";
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

  /*

  */
    playDiary () {
        this.wave = this.add.sprite(this.center_width, 200, "wave").setOrigin(0.5)
        this.anims.create({
            key: "wave",
            frames: this.anims.generateFrameNumbers("wave", { start: 0, end: 4 }),
            frameRate: 20,
            repeat: -1
          });
        this.wave.anims.play("wave", true)
        this.recording = this.sound.add(`diary${this.number}`)
        this.recording.on('complete', function () {
            this.wave.destroy();
            this.showMission();
            this.playCreepy();
        }.bind(this))
        this.recording.play();
      }

  /*

  */
      playCreepy() {
        this.creepy = this.sound.add("creepy")
        this.creepy.play({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
          })
      }

  /*

  */
    showMission () {
        this.text3 = this.add.bitmapText(this.center_width, 300, "pico", "MISSION OBJECTIVE:", 30).setOrigin(0.5)
        this.utils.typeText(this.missions[this.number], "pico", this.center_width, 400, 0xffffff, 20)
    }

  /*

  */
    loadNext () {
        this.sound.add("blip").play();
        this.sound.stopAll();
        this.scene.start("game", {  number: this.number });
    }
}
