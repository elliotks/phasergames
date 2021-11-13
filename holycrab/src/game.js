import Phaser from "phaser";
import Crab from "./crab";
import Block from "./block";
import Shell from "./shell";
import Sky from "./sky";
import FoeGenerator from "./foe_generator";

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
        this.clockText = this.add.bitmapText(this.center_width, this.center_height, "arcade", "00:00", 80).setAlpha(0.1).setOrigin(0.5)
        this.cameras.main.setBounds(0, 0, 10920 * 2, 10080 * 2);
        this.cameras.main.setBackgroundColor(0x3E6875);
        this.addSky();
        this.crab = new Crab(this, 60, 20);
        this.setStartBlock();
        this.setShells();
        this.setKeys();
        this.playMusic();
        this.playBackground();
        this.foeGenerator = new FoeGenerator(this);
        this.foeGenerator.generate()
        /*   this.loadAudios();
        
        this.setGroups();
        this.blockGenerator = new BlockGenerator(this);
        this.setScores();

        this.generateWall();
        this.generateBlock();
        this.updateIncoming()
        this.updateHealth();
        this.startClock();
       */
        this.cameras.main.startFollow(this.crab);
        this.showInstructions();
    }

    setStartBlock () {
        this.blocks = this.add.group();
        [0, 1, 2, 3].forEach( (block, i) => {
            this.blocks.add(new Block(this, (i * 32), 400))
        });
        this.colliderActivated = true;
        this.physics.add.collider(this.crab, this.blocks, this.hitBlock, () => {
            return this.colliderActivated;
        }, this);
    }

    setShells () {
        this.shells = this.add.group();
        this.colliderActivated = true;
        this.physics.add.collider(this.crab, this.shells, this.hitShell, () => {
            return this.colliderActivated;
        }, this);
    }

    hitBlock(crab, block) {
        block.touched(crab);
        crab.hitGround()
    }

    hitShell(crab, shell) {
        crab.hitShell(shell);
        shell.touched(crab);
    }


    addSky() {
        this.sky = new Sky(this);
    }

    setBlock (pointer) {
        console.log("Len:", this.shells.children.entries.length);
        if (this.shells.children.entries.length === 2) return;
        const shell = new Shell(this, pointer.worldX, pointer.worldY, "shell");
        this.shells.add(shell)
        this.time.delayedCall(1000, () => {  this.shells.remove(shell);shell.destroy(); })
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
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.input.on('pointerdown', (pointer) => this.setBlock(pointer), this);
    }

    setScores() {
        this.scoreText = this.add.bitmapText(100, 16, "arcade", "Points: 0", 20).setOrigin(0.5).setScrollFactor(0)
        this.healthText = this.add.bitmapText(this.width - 100, 16, "arcade", "Health: " + this.registry.get("health"), 20).setOrigin(0.5).setScrollFactor(0)
        this.nextBlock = this.add.bitmapText(this.width - 80, 60, "arcade", "Next:", 18)
    }

    showInstructions() {
        this.instructions = this.add.bitmapText(this.center_width, this.center_height - 200, "arcade", "Place a shell with the mouse\nbelow the crab!", 30).setOrigin(0.5).setScrollFactor(0)
        this.tweens.add({
            targets: this.instructions,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.instructions.destroy()
                this.showSpaceInstructions()
            }
        });
    }

    showSpaceInstructions() {
        this.spaceInstructions = this.add.bitmapText(this.center_width, this.center_height + 200, "arcade", "Keep on doing it\nuntil the end!", 30).setOrigin(0.5).setScrollFactor(0)
        this.tweens.add({
            targets: this.spaceInstructions,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.spaceInstructions.destroy()
            }
        });
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

        this.sky.update();
        this.crab.update();
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("music0", {
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

    playBackground() {
        if (this.background) this.background.stop()
        this.background = this.sound.add("background", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.background.play()
    }

    loadAudios () {
        this.audios = {
          "move": this.sound.add("move"),
          "speed": this.sound.add("speed"),
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
        this.scoreText.setText("Points: "+Number(score).toLocaleString());
    }

    updateHealth () {
        let points = this.wall.freePositions;
        this.registry.set("health", points);
        this.healthText.setText("Health: " + Number(points).toLocaleString());
        if (points < 80) {
            this.gameOver();
        }
    }

    blockContact () {
        this.current.setBlock()
        this.wall.removeBlocks(this.current.coords.x, this.current.coords.y, this.current.block.type)
        this.cleanBlocks(this.wall.toRemove);

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
        this.showPoints(blocks)
        blocks.forEach( block => {
            let [x, y, color] = block.split(":");
            this.wall.cell[x][y].content = "";
            this.wall.cell[x][y].block.vanish()
        })
        this.current.vanish()
        this.updateScore(blocks.length);
        this.playAudio("destroy");
    }

    showPoints (blocks) {
        let text = this.add.bitmapText(this.current.x, this.current.y - 10, "arcade", "+"+blocks.length,20, 0xff0000).setOrigin(0.5)
        this.tweens.add({
            targets: text,
            duration: 1000,
            alpha: {from: 1, to: 0},
            y: {from: this.current.y - 10, to: this.current.y - 60},
            onComplete: () => {
                text.destroy()
            }
        });
    }

    changeScreen(name) {
        this.gameOver("splash")
    }

    gameOver (name = "game_over") {
        if (this.theme) this.theme.stop();
        if (this.background) this.background.stop();
        clearInterval(this.evolveId )
        clearInterval(this.clockId);
        this.registry.set("time", this.elapsed);
        this.scene.start(name);
    }

    blockContact2 () {
        this.current.setBlock()
        this.current = null;
        this.generateBlock();
    }

    updateIncoming () {
        this.blockGenerator.incoming.forEach( (block, i) => {
            this.add.image(this.width - 40, 240 - (i * 32), block.type)
        })
    }
}
