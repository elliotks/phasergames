import Phaser from "phaser";
import Bootloader from "./bootloader";
import Outro from "./outro";
import Splash from "./splash";
import Transition from "./transition";
import Scoreboard from "./scoreboard";
import Game from "./game";

const config = {
    width: 608,
    height: 608,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    parent: "contenedor",
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: true
      }
    },
    plugins: {
      },
    scene: [
        Bootloader,
        Splash,
        Scoreboard,
        Transition,
        Game,
        Outro,
    ]
};

const game = new Phaser.Game(config);
