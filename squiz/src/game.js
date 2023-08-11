import Player from "./player";
import Chat from "./chat";
import Quiz from "./questions";

const MAX_ANSWERS = 4;

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
        this.nextOperator = "";
        this.lastMessage = null;
        this.number = "";
        this.counter = 0;
        this.failed = false;
    }

    init () {
    }

    preload () {
        const urlParams = new URLSearchParams(window.location.search);
        let parambg = urlParams.get('background') || "#00b140";
        parambg = parseInt(parambg.substring(1), 16)
        this.backgroundColor = '0x' + parambg.toString(16)

        let paramfg = urlParams.get('foreground') || "#F0EAD6";
        paramfg = parseInt(paramfg.substring(1), 16)
        this.foregroundColor = '0x' + paramfg.toString(16)

        this.spamTimeWait = 2;
        this.result = Phaser.Math.Between(1, 9);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.timeToAnswer = 3000;
        this.infiniteLoop = true;
    }

    async create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.foregroundColor);
        this.allPlayers = {};

        this.addChat();
        this.loadAudios();
        await this.loadQuestions()
        this.addUI();


        this.showNextQuestion();
    }

    async loadQuestions () {
        this.quiz = new Quiz();
        await this.quiz.init();
    }

    addChat () {
        this.chat = new Chat(this);
    }

    addUI () {
        this.questionText = this.add.bitmapText(this.center_width, this.center_height - 50, "mainFont", "question", 30).setOrigin(0.5).setTint(0x000000)
        this.answers = Array(4).fill('').map((answer, i) => {
            return this.add.bitmapText(200 * i, 80 , "mainFont", `Question ${i}`, 15).setOrigin(0).setTint(0x000000)
        });
        this.addScore();
        this.byText = this.add.bitmapText(this.center_width, this.height -10, "mainFont", "by Pello", 10).setOrigin(0.5).setTint(0x000000);
    }

    showNextQuestion() {
        const question = this.quiz.nextQuestion();
        console.log("This is next!! ", question, this.quiz.currentIndex)
        if (!question) {
            this.showResult();
            return;
        }
        this.questionText.setText(question.question);
        this.answers.forEach((answer , i)=> answer.setText(`${i+1}. ${question.answers[i]}`).setTint(0x000000))
        this.showTimestamp = new Date();
        this.time.delayedCall(this.timeToAnswer, () =>{ this.showCorrect()}, null, this )
    }

    showCorrect() {
        this.answers[this.quiz.currentQuestion.correctIndex - 1].setTint(0x00ff00)
        this.time.delayedCall(this.timeToAnswer, () =>{ this.showNextQuestion()}, null, this )
    }

    addScore () {
        const scoreBoard = this.createScoreBoard()
        this.add.bitmapText(this.center_width, 25, "mainFont", "SQUIZ", 25).setOrigin(0.5).setTint(0x000000);
        scoreBoard.slice(0, 3).forEach((player, i) => {
            const winnerText = `${i+1}.  ${player.name}: ${player.score}`;
            this.add.bitmapText(this.center_width, 100 + (i * 50), "mainFont", winnerText, 30).setOrigin(0.5).setTint(this.foregroundColor).setDropShadow(1, 2, 0xbf2522, 0.7);
        })

        this.scoreText1 = this.add.bitmapText(this.center_width, this.center_height + 130, "mainFont", "", 20).setOrigin(0.5).setTint(0x000000);
        this.scoreText2 = this.add.bitmapText(this.center_width, this.center_height + 160, "mainFont", "", 25).setOrigin(0.5).setTint(0x000000);
    }


    addPlayer (name) {
        if (this.allPlayers[name]) return this.allPlayers[name];
        const player = new Player(this, name);
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        return player;
    }

    guess (playerName, number) {
        console.log("Game> guess: ", playerName, number)

        const player = this.addPlayer(playerName);
        player.lastMessage = new Date();

        console.log("Game> guess go on: ", playerName, number)

        if (this.isValidNumber(number) && player.notAnswered(this.quiz.currentIndex)) {
            player.answerQuestion(this.quiz.currentIndex, new Date() - this.showTimestamp, number === this.quiz.currentQuestion.correctIndex)
            console.log("Player", playerName, "guess", number);
        }  
    }

    showScores () {
        console.log
    }

    isValidNumber (number) {
        return !isNaN(number) && number >= 1 && number <= MAX_ANSWERS;
    }

    loadAudios () {
        this.audios = {
            win: this.sound.add("win"),
            drip: this.sound.add("drip"),
            fail: this.sound.add("fail")
        };
    }

    playAudio (key) {
        this.audios[key].play({
            volume: 0.5,
        });
    }

    playRandom(key) {
        this.audios[key].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          delay: 0
        });
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

    update () {
        if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
            this.guess("devdiaries", Phaser.Math.Between(1,4));
        }
    }

    showResult () {
        const scoreBoard = this.createScoreBoard()
        this.scoreRectangle = this.add.rectangle(0, 0, this.width, this.height, this.foregroundColor, 0.9).setOrigin(0, 0);
        this.scores = this.add.group();
        this.scores.add(this.add.bitmapText(this.center_width, 60, "mainFont", "Scoreboard:", 30).setOrigin(0.5).setTint(0x000000));
        scoreBoard.slice(0, 5).forEach((player, i) => {
             const winnerText = `${i+1}.  ${player.name}, ${player.score}`;
             this.scores.add(this.add.bitmapText(this.center_width, 100 + (i * 20), "mainFont", winnerText, 15).setOrigin(0.5).setTint(0x000000));
        })


       console.log("ScoreBoard: ", scoreBoard)

        this.time.delayedCall(5000, async() => {
            this.tweens.add({
                targets: [this.scoreRectangle, this.scores, this.sensei],
                duration: 1000,
                alpha: {from: 1, to: 0},
                onComplete: () => {
                    this.scoreRectangle.destroy();
                    this.scores.getChildren().forEach(function(child) {
                        child.destroy();
                    }, this);

                    this.scores.clear(true, true);
                }
            })
            this.resetScore();
            if (this.infiniteLoop) {
                await this.loadQuestions();
                this.showNextQuestion()
            }

        }, null, this)
    }

    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort((player1, player2) => player2.points - player1.points).sort((player1, player2) => player1.time - player2.time);
    }

    resetScore () {
        this.number = 0;
        this.counter = 0;
        this.failed = false;
        this.quiz.currentIndex = 0;
    }



    showScore (playerName, score) {
        this.scoreText1.setText(`Great!`).setAlpha(1);
        this.scoreText2.setText(`${playerName} +${score}`).setAlpha(1);
        this.tweens.add({
            targets: [this.scoreText1],
            alpha: {from: 1, to: 0},
            ease: 'Linear',
            duration: 3000
        })
    }
}