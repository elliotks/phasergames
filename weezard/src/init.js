import Phaser from 'phaser'
import Bootloader from './bootloader'
import Splash from './splash';
import Game from './game'

const config = {
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false,
  parent: 'contenedor',
  physics: {
    default: "arcade",
    arcade: {
        gravity: { y: 350 },
        debug: false
    }
},
  scene: [
    Bootloader,
    Splash,
    Game,
  ]
}

new Phaser.Game(config)