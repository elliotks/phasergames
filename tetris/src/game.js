import Tetronimo from "./tetronimo";
import Enemy from "./enemy";
import Board from "./board";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.addKeys();
        this.figures = this.add.group();
        this.board = new Board();
        this.addFigure(1000);
        this.moveThisShit();
        // this.addEnemy();
        //this.addColliders();
        // this.loadAudios();
        // this.playMusic();
    }

    addFigure (delay = 5000) {
        this.time.addEvent({
            delay,
            callback: () => {
                const tetronimo = new Tetronimo(4, 4, "L", Phaser.Math.RND.pick(["red", "green", "blue", "yellow", "grey", "black"]));
                this.board.add(tetronimo);
                this.addFigure();
            },
            callbackScope: this,
            loop: true
          });
        // this.figure = new Figure(this, this.center_width, this.center_height + 128);
    }

    moveThisShit (delay = 5000) {
        this.time.addEvent({
            delay,
            callback: () => {
                this.render(this.board);
                console.log(this.board.print());
                this.board.move();
                console.log(this.board.print());
                this.moveThisShit();
            },
            callbackScope: this,
            loop: true
          });
        // this.figure = new Figure(this, this.center_width, this.center_height + 128);
    }

    render (board) {
        board.tetronimos.forEach(tetronimo => {
            console.log("About to render", tetronimo.current);
            tetronimo.current.forEach(({x, y}) => {
                console.log("Rendering position at", tetronimo.x, tetronimo.y, x, y, "with color", tetronimo.color, "and pos: ", (tetronimo.x + x) * 32, (tetronimo.y + y) * 32);
                this.add.sprite((tetronimo.x + x) * 32, (tetronimo.y + y) * 32, tetronimo.color)
            });
        });
    }

    addEnemy () {
        this.enemies = this.add.group();
        this.enemy = new Enemy(this, this.center_width, this.center_height - 128);
    }

    addColliders () {
    /*  this.physics.add.collider(this.figures, this.figures, (obj) => {

    }); */
    }

    loadAudios () {
        this.audios = {
            beam: this.sound.add("beam")
        };
    }

    playAudio (key) {
        this.audios[key].play();
    }

    playMusic (theme = "game") {
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
        });
    }

    addKeys () {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update () {
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.resolve();
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.down) || Phaser.Input.Keyboard.JustDown(this.S)) {
            this.figure.turn();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursor.up) || Phaser.Input.Keyboard.JustDown(this.W)) {
            console.log("Up!");
            this.figure.up();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursor.right) || Phaser.Input.Keyboard.JustDown(this.D)) {
            this.figure.right();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursor.left) || Phaser.Input.Keyboard.JustDown(this.A)) {
            this.figure.left();
        }
    }

    resolve () {

    }

    finishScene () {
        this.sky.stop();
        this.theme.stop();
        this.scene.start("transition", { next: "underwater", name: "STAGE", number: this.number + 1 });
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
