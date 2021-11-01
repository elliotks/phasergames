import Phaser from "phaser";
import CellWall from "./cell_wall";
import BlockGenerator from "./block_generator";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
    }

    preload () {
        this.registry.set("score", 0);
        this.registry.set("health", 100);
        this.registry.set("time", 0);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.clockText = this.add.bitmapText(this.center_width, this.center_height, "arcade", "00:00", 60).setAlpha(0.3).setOrigin(0.5)
        this.loadAudios();
        this.playMusic();
        this.setGroups();
        this.blockGenerator = new BlockGenerator(this);
        this.setScores();
        this.setKeys();
        this.generateWall();
        this.generateBlock();
        this.updateIncoming()
        this.updateHealth();
        this.startClock();
    }

    generateBlock () {
        this.current = this.blockGenerator.generate(this.wall.center);
        this.current.body.setCollideWorldBounds(true);
        this.blockGroup.add(this.current);
    }

    moveBlock () {
        this.current.moveDefault()
    }

    generateWall () {
        this.wall = new CellWall(this);
        this.wall.evolve()
        this.evolveId = setInterval(() => this.wall.evolve(), 10000);
    }

    startClock () {
        this.time = 0;
        this.clockId = setInterval(() => this.updateClock(), 1000);
    }

    updateClock () {
        this.time++;
        this.elapsed = `${Math.round(this.time / 60)}`.padStart(2, 0) + ":" + `${this.time % 60}`.padStart(2, 0);
        this.clockText.setText(this.elapsed)
    }

    setKeys () {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.input.keyboard.on('keyup-LEFT', () => {
            //this.current.x -= this.current.x % 32;
        });
        this.input.keyboard.on('keyup-RIGHT', () => {
            //this.current.x += this.current.x % 32;
        });
        this.input.keyboard.on('keyup-UP', () => {
            //this.current.y -= this.current.y % 32;
        });
        this.input.keyboard.on('keyup-DOWN', () => {
            //this.current.y += this.current.y % 32;
        });
    }

    setScores() {
        this.scoreText = this.add.bitmapText(100, 16, "arcade", "0", 20).setOrigin(0.5).setScrollFactor(0)
        this.healthText = this.add.bitmapText(this.width - 100, 16, "arcade", this.registry.get("health"), 20).setOrigin(0.5).setScrollFactor(0)
        this.nextBlock = this.add.bitmapText(this.width - 80, 60, "arcade", "Next:", 18)
    }

    setGroups () {
        this.sicknessGroup = this.add.group();
        this.blockGroup = this.add.group();
        this.physics.add.overlap(this.sicknessGroup, this.blockGroup, this.blockContact);
    }

    update () {
        if (this.ESC.isDown) {
            this.changeScreen("splash")
        }
      
        if (this.current) {
            //if (Phaser.Input.Keyboard.JustDown(this.cursor.left) || this.A.isDown) {
            if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
                this.current.stopSpeed();
                this.current.defaultDirection = 1;
                this.current.left();
                this.playAudio("move");
            }  else if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) { // this.cursor.right.getDuration() > 100
                this.current.stopSpeed();
                this.current.defaultDirection = 0;
                this.current.right();
                this.playAudio("move");
            } else if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
                this.current.stopSpeed();
                this.current.defaultDirection = 3;
                this.current.up();
                this.playAudio("move");
            } else if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {
                this.current.stopSpeed();
                this.current.defaultDirection = 2;
                this.current.down();
                this.playAudio("move");
            } else if (this.SPACE.isDown) {
                this.current.speedUp();
                this.playAudio("move");
            } else {
               // this.current.moveDefault();
            }
            this.current.correctPosition()
        }

        this.wall.update();
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("muzik", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.theme.play()
    }

    loadAudios () {
        this.audios = {
          "move": this.sound.add("move"),
          "bump": this.sound.add("bump"),
          "cellheart": this.sound.add("cellheart"),
          "destroy": this.sound.add("destroy"),
          "evolve": this.sound.add("evolve"),
        };
      }

    playAudio(key) {
        this.audios[key].play();
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateHealth () {
        let points = this.wall.freePositions;
        this.registry.set("health", points);
        this.healthText.setText(Number(points).toLocaleString());
        if (points < 80) {
            this.gameOver();
        }
    }

    blockContact () {
        this.current.setBlock()
        this.physics.world.removeCollider(this.wallCollider);
        this.wall.removeBlocks(this.current.coords.x, this.current.coords.y, this.current.block.type)
        this.cleanBlocks(this.wall.toRemove);
        console.log("Block contact!")
        // TODO remove block from group
        this.current = null;
        this.updateHealth()
        this.generateBlock();
        this.updateIncoming();
    }

    cleanBlocks (blocks) {
        if (blocks.length < 2) {
            this.playAudio("bump");
            return;
        } 
        blocks.forEach( block => {
            let [x, y, color] = block.split(":");
            this.wall.cell[x][y].content = "";
            if (this.wall.cell[x][y].block) this.wall.cell[x][y].block.vanish()
        })
        this.current.vanish()
        this.updateScore(blocks.length);
        this.playAudio("destroy");
    }

    changeScreen(name) {
        this.gameOver("splash")
    }

    gameOver (name = "game_over") {
        if (this.theme) this.theme.stop();
        clearInterval(this.evolveId )
        clearInterval(this.clockId);
        this.registry.set("time", this.elapsed);
        this.scene.start(name);
    }

    blockContact2 () {
        this.current.setBlock()
        console.log("Block contact!")
        this.current = null;
        this.generateBlock();
    }

    updateIncoming () {
        this.blockGenerator.incoming.forEach( (block, i) => {
            this.add.image(this.width - 40, 240 - (i * 32), block.type)
        })
    }
}
