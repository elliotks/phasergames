import Phaser from "phaser";
import Splash from "./splash";
import Stage1 from "./stage1";
import Stage2 from "./stage2";
import Stage3 from "./stage3";
import Bootloader from "./bootloader";
import GameOver from "./game_over";
import Transition from "./transition";

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "phaser-example",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 868,
        height: 800
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 350 },
            debug: false
        }
    },
    scene: [Bootloader, Splash, Stage1, Stage2, Stage3, GameOver, Transition]
};

new Phaser.Game(config);
